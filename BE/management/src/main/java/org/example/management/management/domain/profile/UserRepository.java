package org.example.management.management.domain.profile;


import java.util.List;
import java.util.Optional;

public interface UserRepository {
    User save(User user);

    User update(User user);

    User delete(User user);

    Iterable<User> getAllUser(User user);

    Optional<User> findById(int id);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    List<User> findAllByIds(List<Integer> userIds);

    List<User> findAllByManagerId(int managerId);
    
    List<User> findByRole(User.Role role);

    Optional<User> findByEmail(String email);
}
