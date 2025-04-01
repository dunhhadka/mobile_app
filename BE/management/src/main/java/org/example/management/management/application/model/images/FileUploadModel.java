package org.example.management.management.application.model.images;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileUploadModel {
    private String fileName;
    private String contentType;
    private byte[] bytes;
}
