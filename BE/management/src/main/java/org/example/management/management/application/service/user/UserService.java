package org.example.management.management.application.service.user;

import jakarta.validation.Valid;
import org.example.management.management.application.model.user.request.ChangePasswordRequest;
import org.example.management.management.application.model.user.request.LoginRequest;
import org.example.management.management.application.model.user.request.UserFilterRequest;
import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


public interface UserService {
    UserResponse createUser(UserRequest request);

    UserResponse getUserById(int id);

    List<UserResponse> getByManagerId(int managerId);

    UserResponse updateUser(int id, UserRequest request);

    List<UserResponse> getByIds(List<Integer> userIds);

    Page<UserResponse> filter(UserFilterRequest request);

    void upload(int userId, MultipartFile file) throws IOException;

    UserResponse findById(int id);

    UserResponse login(@Valid LoginRequest request);

    UserResponse changePassword(int userId, ChangePasswordRequest request);
}
