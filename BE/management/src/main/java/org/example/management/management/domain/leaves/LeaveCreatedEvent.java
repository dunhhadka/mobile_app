package org.example.management.management.domain.leaves;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.management.ddd.DomainEvent;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record LeaveCreatedEvent(
        Instant createdAt,
        Integer managerId,
        Integer createdBy,
        Integer leaveId,
        String category, // Loại nghỉ (ví dụ: nghỉ phép, nghỉ ốm)
        LocalDate startLeave,
        LocalDate endLeave
) {
}
