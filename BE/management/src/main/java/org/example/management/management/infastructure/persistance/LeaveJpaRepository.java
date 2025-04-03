package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.leaves.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveJpaRepository extends JpaRepository<Leave, Integer> {
    List<Leave> findByIdIn(List<Integer> leaveIds);
}
