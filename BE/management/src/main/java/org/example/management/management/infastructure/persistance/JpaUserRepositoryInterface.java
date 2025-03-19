package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.profile.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaUserRepositoryInterface extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);

    List<User> findByIdIn(List<Integer> userIds);
}
