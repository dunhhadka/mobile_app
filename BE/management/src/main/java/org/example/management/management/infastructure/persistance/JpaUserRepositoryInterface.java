package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.profile.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface JpaUserRepositoryInterface extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    List<User> findByIdIn(List<Integer> userIds);

    Page<User> findAll(Specification<User> spec, Pageable pageable);

    Optional<User> findByEmailAndPassword(String email, String password);
}
