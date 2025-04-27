package org.example.management.management.application.service.mail;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MailEvent {
    String channel;
    String recipient; // mail người nhận
    String templateCode; // template nào
    String subject; // tiêu đề email
    Map<String, Object> params;
}
