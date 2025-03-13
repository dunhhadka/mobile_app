package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.user.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/sign-up")
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {
        return userService.createUser(request);
    }


    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable(name = "id") @Min(1) int id) {
        //code
        return null;
    }

    @PutMapping("/update/{id}")
    public UserResponse updateUser(
            @PathVariable(name = "id") int id,
            @Valid @RequestBody UserRequest request
    ) {
        return this.userService.updateUser(id, request);
    }

}
