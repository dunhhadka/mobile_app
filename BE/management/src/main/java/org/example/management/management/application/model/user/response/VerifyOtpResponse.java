package org.example.management.management.application.model.user.response;

import lombok.Builder;

@Builder
public record VerifyOtpResponse(
        boolean isValid
) {
}
