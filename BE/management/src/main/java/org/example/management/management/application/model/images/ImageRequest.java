package org.example.management.management.application.model.images;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@SuperBuilder
public class ImageRequest {
    /**
     * nếu như client không gửi được dạng file <br/>
     * => support submit ảnh trước rồi sau đó mới tạo object chứa image
     */
    private String alt;

    private Integer id;

    private MultipartFile file;

    private String name;
}
