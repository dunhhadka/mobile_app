package org.example.management.management.domain.leaves;

import lombok.Builder;

import java.time.Instant;
import java.time.LocalDate;

public record LeaveUpdateStatusEvent(
        Instant createdAt,
        Integer managerId,
        Integer createdBy,
        Integer leaveId,
        String category, // Loại nghỉ (ví dụ: nghỉ phép, nghỉ ốm)
        LocalDate startLeave,
        LocalDate endLeave
) {
}