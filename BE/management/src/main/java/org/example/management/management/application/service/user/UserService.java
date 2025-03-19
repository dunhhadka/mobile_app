package org.example.management.management.application.service.user;

import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;

import java.util.List;


public interface UserService {
    UserResponse createUser(UserRequest request);

    UserResponse getUserById(int id);

    UserResponse updateUser(int id, UserRequest request);

    List<UserResponse> getByIds(List<Integer> userIds);
}
