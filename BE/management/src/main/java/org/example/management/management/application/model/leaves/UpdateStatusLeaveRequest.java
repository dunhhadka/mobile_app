package org.example.management.management.application.model.leaves;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.management.management.domain.leaves.Leave;

@Getter
@Setter
public class UpdateStatusLeaveRequest {
    private Leave.Status status;
    private String reason; // có thể thêm lí do từ chối hoặc chấp thuận
}
