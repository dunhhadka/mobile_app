package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.leaves.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveJpaRepository extends JpaRepository<Leave, Integer> {
    List<Leave> findByIdIn(List<Integer> leaveIds);
    @Query("SELECT l FROM Leave l WHERE l.createdBy = :createdBy ORDER BY l.id DESC")
    List<Leave> findByCreatedBy(@Param("createdBy") Integer createdBy);
}
