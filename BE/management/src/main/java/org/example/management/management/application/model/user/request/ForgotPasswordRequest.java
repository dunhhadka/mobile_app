package org.example.management.management.application.model.user.request;

import lombok.Builder;

@Builder
public record ForgotPasswordRequest(
        String email
) {
}
