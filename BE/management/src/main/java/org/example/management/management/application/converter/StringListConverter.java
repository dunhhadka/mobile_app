package org.example.management.management.application.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {
    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (CollectionUtils.isEmpty(attribute)) {
            log.info("attribute is empty or null value");
            return null;
        }
        return attribute.stream()
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.joining(","));
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (StringUtils.isBlank(dbData) || ",".equals(dbData.trim())) {
            return List.of();
        }
        return Arrays.stream(dbData.split(","))
                .filter(StringUtils::isNotBlank)
                .toList();
    }
}
