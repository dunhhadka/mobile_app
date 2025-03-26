package org.example.management.management.domain.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.management.management.application.model.images.StoredImageResult;

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Size(max = 255)
    private String alt;

    @NotNull
    private String src;

    @NotNull
    private String fileName;

    @Embedded
    private ImagePhysicalInfo physicalInfo;

    public Image(StoredImageResult stored) {
        this.src = stored.getSrc();
        this.fileName = stored.getFileName();
        this.physicalInfo = ImagePhysicalInfo.builder()
                .size(stored.getSize())
                .height(stored.getHeight())
                .width(stored.getWidth())
                .build();
    }
}
