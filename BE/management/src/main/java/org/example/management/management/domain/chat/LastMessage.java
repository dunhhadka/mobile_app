package org.example.management.management.domain.chat;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class LastMessage {
    @Positive
    private int senderId;

    @NotBlank
    private String content;

    @NotNull
    private Instant sendTime;
}
