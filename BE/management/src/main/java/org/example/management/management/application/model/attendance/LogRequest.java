package org.example.management.management.application.model.attendance;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import org.example.management.management.domain.attendace.Log;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Getter
@Setter
public class LogRequest {
    @NotNull
    private Instant checkIn;

    @NotNull
    private Log.Type type;

    private MultipartFile logImage;
    private Integer imageId;

    private String note;

    private String latitude;
    private String longitude;

    @PositiveOrZero
    private int userId;
}
