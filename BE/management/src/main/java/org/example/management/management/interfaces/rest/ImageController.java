package org.example.management.management.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.images.ImageRequest;
import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.application.service.images.ImageProcessService;
import org.example.management.management.application.service.task.TaskMapper;
import org.example.management.management.domain.task.Image;
import org.example.management.management.infastructure.persistance.ImageRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImageController {

    private final ImageRepository imageRepository;
    private final ImageProcessService imageProcessService;
    private final TaskMapper taskMapper;

    @PostMapping("/upload")
    public ImageResponse upload(@RequestParam("file") MultipartFile file) throws IOException {
        var imagesSaved = this.uploadImageWithFile(file);

        return taskMapper.toResponse(imagesSaved);
    }

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
