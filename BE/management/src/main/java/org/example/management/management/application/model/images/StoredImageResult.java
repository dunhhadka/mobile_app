package org.example.management.management.application.model.images;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoredImageResult {
    private String src;
    private String fileName;
    private Integer size;
    private Integer height;
    private Integer width;
}
