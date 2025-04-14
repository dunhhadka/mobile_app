package org.example.management.management.application.service.images;

import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.images.ImageRequest;
import org.example.management.management.domain.task.Image;
import org.example.management.management.infastructure.persistance.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final ImageProcessService imageProcessService;

    public Image uploadImageWithFile(MultipartFile multipartFile) throws IOException {
        var imageRequest = ImageRequest.builder()
                .file(multipartFile)
                .build();
        var imagesStored = this.imageProcessService.process(List.of(imageRequest));

        List<Image> images = imagesStored.stream()
                .filter(Objects::nonNull)
                .map(Image::new)
                .toList();

        return imageRepository.saveAll(images).get(0);
    }
}
