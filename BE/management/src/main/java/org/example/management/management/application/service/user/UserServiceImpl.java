package org.example.management.management.application.service.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.example.management.management.application.model.user.request.*;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.model.user.response.VerifyOtpResponse;
import org.example.management.management.application.service.images.ImageService;
import org.example.management.management.application.service.mail.MailEvent;
import org.example.management.management.application.utils.NumberUtils;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.UserRepository;
import org.example.management.management.domain.profile.User_;
import org.example.management.management.domain.task.Image;
import org.example.management.management.domain.task.ProjectManagement;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.persistance.ImageRepository;
import org.example.management.management.infastructure.persistance.JpaUserRepositoryInterface;
import org.example.management.management.infastructure.persistance.ProjectManagementRepository;
import org.example.management.management.interfaces.rest.ImageController;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
//    private final PasswordEncoder passwordEncoder;

    private final JpaUserRepositoryInterface repositoryInterface;

    private final ImageController imageController;

    private final ImageRepository imageRepository;

    private final ImageService imageService;

    private final ProjectManagementRepository projectManagementRepository;

    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConstrainViolationException(request.getEmail(), "Email đã tồn tại. Vui lòng chọn Email khác");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConstrainViolationException(request.getPhone(), "Số điện thoại đã tồn tại.");
        }
        User user = userMapper.toUser(request);

        String name = Stream.of(request.getFirstName(), request.getLastName())
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.joining(" "));
        user.setPosition(request.getPosition());
        user.setUserName(name);
        user.setPassword(request.getPassword());
        user.setRole(User.Role.member);
        user.setDefaultColor(request.getDefaultColor());
        userRepository.save(user);
        return this.getByIds(List.of(user.getId())).get(0);
    }


    @Override
    public UserResponse getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(RuntimeException::new);
        return this.getByIds(List.of(user.getId())).get(0);
    }

    @Override
    public List<UserResponse> getByManagerId(int managerId) {
        List<User> users = userRepository.findAllByManagerId(managerId);
        var imageIds = users.stream().map(User::getAvatarId).toList();
        var images = imageRepository.findAllById(imageIds).stream().collect(Collectors.toMap(
                Image::getId, Function.identity()
        ));
        return users.stream().map(user -> userMapper.toUserResponse(user, user.getAvatarId()==null? null:images.get(user.getAvatarId()))).toList();
    }

    @Override
    @Transactional
    public UserResponse updateUser(int id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ConstrainViolationException("id", "User not exists"));
        userMapper.updateUser(user, request);

        user.updateAddress(request.getAddress());
        user.setDefaultColor(request.getDefaultColor());
        String name = Stream.of(request.getFirstName(), request.getLastName())
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.joining(" "));
        user.setUserName(name);
        userRepository.save(user);
        return this.getByIds(List.of(user.getId())).get(0);
    }

    @Override
    public List<UserResponse> getByIds(List<Integer> userIds) {
        if (CollectionUtils.isEmpty(userIds)) {
            return Collections.emptyList();
        }

        var users = this.repositoryInterface.findByIdIn(userIds);
        var imageIds = users.stream()
                .map(User::getAvatarId)
                .filter(NumberUtils::isPositive)
                .toList();
        var images = this.imageRepository.findByIdIn(imageIds).stream()
                .collect(Collectors.toMap(Image::getId, Function.identity()));

        return users.stream()
                .map(user -> this.userMapper.toUserResponse(user, user.getAvatarId() == null ? null : images.get(user.getAvatarId())))
                .toList();
    }

    @Override
    public Page<UserResponse> filter(UserFilterRequest request) {
        var pageable = PageRequest.of(request.getPageNumber() - 1, request.getPageSize(), Sort.by(User_.ID).descending());

        if (request.getProjectId() != null) {
            this.setUser(request, request.getProjectId());
        }

        var pageUsers = getUserResponse(request, pageable);

        return new PageImpl<>(pageUsers.getKey(), pageable, pageUsers.getRight());
    }

    private void setUser(UserFilterRequest request, Integer projectId) {
        var projectManagements = this.projectManagementRepository.findByProjectId(projectId);
        if (CollectionUtils.isEmpty(projectManagements))
            return;
        var userIds = projectManagements.stream()
                .map(ProjectManagement::getUserId)
                .toList();
        request.setIds(userIds);
    }

    @Override
    public void upload(int userId, MultipartFile file) throws IOException {
        var user = this.repositoryInterface.findById(userId)
                .orElseThrow(() -> new ConstrainViolationException(
                        "user",
                        "user not found by id = " + userId
                ));
        var imageSaved = this.imageService.uploadImageWithFile(file);
        user.setAvatarId(imageSaved.getId());

        this.repositoryInterface.save(user);
    }

    @Override
    public UserResponse findById(int userId) {
        var user = this.repositoryInterface.findById(userId)
                .orElseThrow(() -> new ConstrainViolationException(
                        "user",
                        "user not found by id = " + userId
                ));
        return this.userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse login(LoginRequest request) {
        var possiblyUser = this.repositoryInterface.findByEmailAndPassword(request.getEmail(), request.getPassword());
        if (possiblyUser.isEmpty()) {
            throw new ConstrainViolationException(
                    "user",
                    "Email hoặc mật khẩu không đúng"
            );
        }
        return this.getByIds(List.of(possiblyUser.get().getId())).get(0);
    }

    @Override
    public UserResponse changePassword(int userId, ChangePasswordRequest request) {
        var user = this.repositoryInterface.findById(userId)
                .orElseThrow(() ->
                        new ConstrainViolationException(
                                "user",
                                "Không tìm thấy người dùng với id là " + userId
                        ));

        var oldPassword = request.getOldPassword();
        var newPassword = request.getNewPassword();

        if (!StringUtils.equals(oldPassword, user.getPassword())) {
            throw new ConstrainViolationException(
                    "password",
                    "Mật khẩu hiện tại không đúng"
            );
        }

        user.setPassword(newPassword);

        this.repositoryInterface.save(user);

        return this.getByIds(List.of(userId)).get(0);

    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ConstrainViolationException("email", "Tài khoản với email không tồn tại"));
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.ofInstant(Instant.now().plus(10, ChronoUnit.MINUTES), ZoneId.systemDefault()));
        userRepository.save(user);
        sendVerificationEmail(user, otp);
    }

    @Override
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ConstrainViolationException("user", "Tài khoản không tồn tại"));
        if (StringUtils.isBlank(user.getOtp()) || !user.getOtp().equals(request.otp())) {
            return VerifyOtpResponse.builder()
                    .isValid(false)
                    .build();
        }
        if (user.getOtpExpiryTime() == null || user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            return VerifyOtpResponse.builder()
                    .isValid(false)
                    .build();
        }
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        String newPassword = generatePassword(6);
        user.setPassword(newPassword);
        userRepository.save(user);
        sendNewPassword(user, newPassword);
        return VerifyOtpResponse.builder()
                .isValid(true)
                .build();
    }

    private void sendVerificationEmail(User user, String otp) {
        Map<String, Object> props = new HashMap<>();
        props.put("recipientName", user.getUserName());
        props.put("otpCode", otp);

        MailEvent event = MailEvent.builder()
                .channel("EMAIL")
                .subject("Verify Otp")
                .params(props)
                .recipient(user.getEmail())
                .templateCode("otp-email")
                .build();

        this.eventPublisher.publishEvent(event);
    }

    private void sendNewPassword(User user, String password) {
        Map<String, Object> props = new HashMap<>();
        props.put("recipientName", user.getUserName());
        props.put("newPassword", password);

        MailEvent event = MailEvent.builder()
                .channel("EMAIL")
                .subject("New Password")
                .params(props)
                .recipient(user.getEmail())
                .templateCode("new-password")
                .build();
        this.eventPublisher.publishEvent(event);
    }

    private String generatePassword(int length) {
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String digits = "0123456789";
        String allChars = lowercase + uppercase + digits;

        // Sử dụng SecureRandom để tạo số ngẫu nhiên an toàn
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        // Đảm bảo mật khẩu có ít nhất 1 chữ thường, 1 chữ hoa, 1 số
        password.append(lowercase.charAt(random.nextInt(lowercase.length())));
        password.append(uppercase.charAt(random.nextInt(uppercase.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));

        // Thêm các ký tự ngẫu nhiên cho đến khi đạt độ dài mong muốn
        for (int i = 3; i < length; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Xáo trộn mật khẩu
        char[] passwordArray = password.toString().toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }

        return new String(passwordArray);
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder("");
        for(int i = 0; i < 6; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private Pair<List<UserResponse>, Long> getUserResponse(UserFilterRequest request, PageRequest pageable) {
        var specification = buildUserSpecification(request);

        var page = this.repositoryInterface.findAll(specification, pageable);

        var users = page.getContent()
                .stream()
                .map(this.userMapper::toUserResponse)
                .toList();

        return Pair.of(users, page.getTotalElements());
    }

    private Specification<User> buildUserSpecification(UserFilterRequest request) {
        Specification<User> specification = Specification.where(null);

        if (CollectionUtils.isNotEmpty(request.getIds())) {
            specification = specification.and(UserSpecification.hasIdIn(request.getIds()));
        }

        return specification;
    }
}
