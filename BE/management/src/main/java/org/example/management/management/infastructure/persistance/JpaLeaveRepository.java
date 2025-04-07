package org.example.management.management.infastructure.persistance;

import lombok.RequiredArgsConstructor;
import org.example.management.management.domain.leaves.Leave;
import org.example.management.management.domain.leaves.LeaveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class JpaLeaveRepository implements LeaveRepository {

    private final LeaveJpaRepository leaveJpaRepository;

    @Override
    public Optional<Leave> findById(int leaveId) {
        return leaveJpaRepository.findById(leaveId);
    }

    @Override
    public Leave save(Leave leave) {
        return leaveJpaRepository.save(leave);
    }

    @Override
    public List<Leave> findByIdIn(List<Integer> leaveIds) {
        return leaveJpaRepository.findByIdIn(leaveIds);
    }
}
