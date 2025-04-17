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

    private Instant createdAt;
}
