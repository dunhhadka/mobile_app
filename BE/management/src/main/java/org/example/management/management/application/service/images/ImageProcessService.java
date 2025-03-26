package org.example.management.management.application.service.images;

import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.example.management.management.application.model.images.FileUploadModel;
import org.example.management.management.application.model.images.ImageRequest;
import org.example.management.management.application.model.images.StoredImageResult;
import org.example.management.management.application.service.task.TaskService;
import org.example.management.management.infastructure.persistance.ImageRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageProcessService {

    private final ImageRepository imageRepository;

    private final UploadClient uploadClient;

    public <T extends ImageRequest> List<StoredImageResult> process(List<T> images) throws IOException {
        if (CollectionUtils.isEmpty(images)) return List.of();

        var fileUploadModels = prepareFileUploadRequests(images, false);

        List<StoredImageResult> result = new ArrayList<>();
        for (var model : fileUploadModels) {
            StoredImageResult stored = null;
            var mapResult = this.uploadClient.upload(model);
            if (mapResult != null) {
                stored = new StoredImageResult();
                stored.setFileName(String.valueOf(mapResult.get("public_id")));
                stored.setSrc(String.valueOf(mapResult.get("url")));
                stored.setSize(mapResult.get("bytes") == null ? 0 : (Integer) mapResult.get("bytes"));
                stored.setHeight(mapResult.get("height") == null ? 0 : (Integer) mapResult.get("height"));
                stored.setWidth(mapResult.get("width") == null ? 0 : (Integer) mapResult.get("width"));
            }
            result.add(stored);
        }

        return result;
    }

    private <T extends ImageRequest> List<FileUploadModel> prepareFileUploadRequests(List<T> imageRequests, boolean allowDuplicate) throws IOException {
        var fileUploads = new ArrayList<FileUploadModel>();

        for (var imageReq : imageRequests) {
            if (imageReq == null || imageReq.getFile() == null) {
                fileUploads.add(null);
                continue;
            }

            var fileName = detectFileName(imageReq);

            var contentType = imageReq.getFile().getContentType();

            var bytes = imageReq.getFile().getBytes();

            var fileModel = new FileUploadModel();

            fileModel.setFileName(fileName);
            fileModel.setContentType(contentType);
            fileModel.setBytes(bytes);

            fileUploads.add(fileModel);

            if (!allowDuplicate) {
                fileName = this.checkFileName(fileModel.getFileName());
            }
        }

        return fileUploads;
    }

    private String checkFileName(String fileName) {
        String finalFileName = fileName;
        if (this.imageRepository.existsByFileName(fileName)) {
            finalFileName = UUID.randomUUID().toString().replace("-", "");
        }
        return finalFileName;
    }

    private <T extends ImageRequest> String detectFileName(T imageReq) {
        var fileName = imageReq.getFile().getOriginalFilename();
        if (StringUtils.isEmpty(fileName)) {
            fileName = UUID.randomUUID().toString().replace("-", "");
        }
        return fileName;
    }

    @Async
    @EventListener(TaskService.ImageDeletedEvent.class)
    public void handleImageDeletedEvent(TaskService.ImageDeletedEvent event) {
        var imageIds = event.imageIds();
        if (CollectionUtils.isEmpty(imageIds)) return;

        var images = this.imageRepository.findByIdIn(imageIds);

        images.forEach(image -> {
            try {
                this.uploadClient.delete(image.getFileName());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
