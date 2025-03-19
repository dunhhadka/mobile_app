package org.example.management.management.domain.profile;


import java.util.Optional;

public interface UserRepository {
    User save(User user);

    User update(User user);

    User delete(User user);

    Iterable<User> getAllUser(User user);

    Optional<User> findById(int id);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);
}
