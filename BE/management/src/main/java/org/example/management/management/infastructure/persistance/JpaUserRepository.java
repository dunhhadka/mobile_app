package org.example.management.management.infastructure.persistance;

import lombok.RequiredArgsConstructor;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JpaUserRepository implements UserRepository {
    private final JpaUserRepositoryInterface userRepositoryInterface;

    @Override
    public User save (User user) {
        return userRepositoryInterface.save(user);
    }

    @Override
    public User update(User user) {
        return null;
    }

    @Override
    public User delete(User user) {
        return null;
    }

    @Override
    public Iterable<User> getAllUser(User user) {
        return userRepositoryInterface.findAll();
    }

    @Override
    public Optional<User> findById(int id) {
        return userRepositoryInterface.findById(id);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepositoryInterface.existsByEmail(email);
    }

    @Override
    public Boolean existsByPhone(String phone) {
        return userRepositoryInterface.existsByPhone(phone);
    }

    @Override
    public List<User> findAllByIds(List<Integer> userIds) {
        return userRepositoryInterface.findByIdIn(userIds);
    }

    @Override
    public List<User> findByRole(User.Role role) {
        return userRepositoryInterface.findByRoleName(role);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepositoryInterface.findByEmail(email);
    }
}
