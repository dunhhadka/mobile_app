package org.example.management.management.application.service.images;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.images.FileUploadModel;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class UploadClientImpl implements UploadClient {

    public static final String folder = "mobile";

    private final Cloudinary cloudinary;

    @Override
    public Map<String, Object> upload(FileUploadModel uploadModel) throws IOException {
        return this.cloudinary.uploader().upload(
                uploadModel.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "public_id", uploadModel.getFileName(),
                        "resource_type", "auto",
                        "overwrite", true,
                        "format", getFormatFromContentType(uploadModel.getContentType())
                )
        );
    }

    @Override
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    private String getFormatFromContentType(String contentType) {
        if (contentType == null) return "auto";
        switch (contentType) {
            case "image/png":
                return "png";
            case "image/jpeg":
                return "jpg";
            case "image/gif":
                return "gif";
            case "image/webp":
                return "webp";
            case "application/pdf":
                return "pdf";
            case "video/mp4":
                return "mp4";
            default:
                return "auto";
        }
    }
}
