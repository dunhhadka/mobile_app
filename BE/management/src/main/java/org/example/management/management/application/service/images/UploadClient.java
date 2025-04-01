package org.example.management.management.application.service.images;

import org.example.management.management.application.model.images.FileUploadModel;

import java.io.IOException;
import java.util.Map;

public interface UploadClient {
    Map<String, Object> upload(FileUploadModel uploadModel) throws IOException;

    void delete(String publicId) throws IOException;
}
