package org.example.management.management.application.model.user.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    private String oldPassword;
    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;
}
