package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.attendace.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface LogRepository extends JpaRepository<Log, Integer> {

    @Query("SELECT l FROM Log l WHERE l.userId = :userId AND DATE(l.checkIn) = :date")
    List<Log> findByUserIdAndDate(int userId, LocalDate date);

}
