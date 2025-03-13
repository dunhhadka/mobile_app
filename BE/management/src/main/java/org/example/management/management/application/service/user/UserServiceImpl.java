package org.example.management.management.application.service.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.profile.Address;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.UserRepository;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (request == null) {
            throw new ConstrainViolationException("request", "Request is null");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConstrainViolationException(request.getEmail(), "Email has been existed!");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConstrainViolationException(request.getPhone(), "Phone has bean existed!");
        }
        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.member);
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }


    @Override
    public UserResponse getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(RuntimeException::new);
        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(int id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ConstrainViolationException("id", "User not exists"));
        userMapper.updateUser(user, request);

        user.updateAddress(request.getAddress());

        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }
}
