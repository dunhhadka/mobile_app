package org.example.management.management.application.model.images;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageResponse {
    private int id;
    private String alt;
    private String src;
    private String fileName;

    private ImagePhysicalInfo physicalInfo;

    @Getter
    @Setter
    public static class ImagePhysicalInfo {
        private int size;
        private int width;
        private int height;
    }
}
