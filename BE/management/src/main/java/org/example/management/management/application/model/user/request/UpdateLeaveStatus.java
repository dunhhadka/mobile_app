package org.example.management.management.application.model.user.request;

import lombok.Builder;
import org.example.management.management.domain.leaves.Leave;

@Builder
public record UpdateLeaveStatus(
        Leave.Status status
) {
}
