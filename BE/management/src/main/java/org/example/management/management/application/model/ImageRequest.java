package org.example.management.management.application.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ImageRequest {
    /**
     * nếu như client không gửi được dạng file <br/>
     * => support submit ảnh trước rồi sau đó mới tạo object chứa image
     */
    private Integer imageId;

    private MultipartFile file;

    private String name;
}
