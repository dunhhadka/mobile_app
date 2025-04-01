package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.task.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    boolean existsByFileName(String fileName);

    List<Image> findByIdIn(List<Integer> ids);
}
