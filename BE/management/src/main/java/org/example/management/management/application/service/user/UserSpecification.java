package org.example.management.management.application.service.user;

import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.profile.User_;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class UserSpecification {

    public static Specification<User> hasIdIn(List<Integer> ids) {
        return ((root, query, builder) -> root.get(User_.id).in(ids));
    }
}
