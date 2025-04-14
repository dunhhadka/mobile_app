package org.example.management.management.application.model.attendance;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.attendace.Log;

@Getter
@Setter
public class LogResponse {
    private int id;

    private Log.Type type;

    private ImageResponse image;

    private String note;

    private String latitude;
    private String longitude;

    private UserResponse user;
}
