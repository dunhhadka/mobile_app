package org.example.management.management.domain.leaves;

import java.util.List;
import java.util.Optional;


public interface LeaveRepository {
    Optional<Leave> findById(Integer leaveId);
    Leave save(Leave leave);
    List<Leave> findByIdIn(List<Integer> leaveIds);
    List<Leave> findByCreatedBy(Integer createdBy);
}
