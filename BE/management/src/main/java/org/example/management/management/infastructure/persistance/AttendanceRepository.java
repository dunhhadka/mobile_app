package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.attendace.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
}
