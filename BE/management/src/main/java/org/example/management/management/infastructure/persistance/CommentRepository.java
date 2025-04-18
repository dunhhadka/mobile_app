package org.example.management.management.infastructure.persistance;

import org.example.management.management.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByTaskId(int taskId);

}
