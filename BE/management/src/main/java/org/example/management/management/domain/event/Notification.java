package org.example.management.management.domain.event;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String receiveMessage;

    private int eventId;

    private int receiveId;

    private boolean isRead;

    @Enumerated(value = EnumType.STRING)
    private Type type;

    private Instant createdAt;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String data;

    public enum Type {
        messenger, // các thông báo liên quan đến messager
        task, // các thông báo liên quan đến task,
        comment, // các thông báo liên quan đến người tạo recomment task,
        deadline, // thông báo liên quan đến nhắc nhở task,
        user, // thông báo liên quan đến người dùng VD: thêm vào project, tạp project
    }
}
