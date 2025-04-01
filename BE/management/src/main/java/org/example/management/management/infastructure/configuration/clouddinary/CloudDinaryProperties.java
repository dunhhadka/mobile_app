package org.example.management.management.infastructure.configuration.clouddinary;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "cloudinary")
public class CloudDinaryProperties {
    private String cloudName;
    private String apiKey;
    private String apiSecret;
}