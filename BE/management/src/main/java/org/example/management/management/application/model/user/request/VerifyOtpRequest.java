package org.example.management.management.application.model.user.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerifyOtpRequest(
        @NotBlank
        String email,
        @NotBlank
        @Size(min = 6, max = 6)
        String otp
) {
}
