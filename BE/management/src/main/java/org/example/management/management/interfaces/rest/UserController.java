package org.example.management.management.interfaces.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.user.request.LoginRequest;
import org.example.management.management.application.model.user.request.UserFilterRequest;
import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.application.service.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Operation(summary = "sign up", description = "Send a request via this API to create new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved",
                    content = @Content(schema = @Schema(implementation = UserResponse.class)))
    })
    @PostMapping("/sign-up")
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {
        return userService.createUser(request);
    }


    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable(name = "id") @Min(1) int id) {
        //code
        return userService.findById(id);
    }

    @PutMapping("/update/{id}")
    public UserResponse updateUser(
            @PathVariable(name = "id") int id,
            @Valid @RequestBody UserRequest request
    ) {
        return this.userService.updateUser(id, request);
    }

    @PostMapping("/filter")
    public List<UserResponse> filter(@RequestBody UserFilterRequest request) {
        var userPage = this.userService.filter(request);
        return userPage.getContent();
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/{userId}/upload")
    public UserResponse upload(@PathVariable int userId, @RequestParam("file") MultipartFile file) throws IOException {
        this.userService.upload(userId, file);
        return userService.getUserById(userId);
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request) {
        return this.userService.login(request);
    }
}
