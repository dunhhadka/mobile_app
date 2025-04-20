package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.attendace.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    @Query("SELECT a FROM Attendance a WHERE a.userId = :userId")
    List<Attendance> findAllByUserId(@Param("userId") int userId);
}
