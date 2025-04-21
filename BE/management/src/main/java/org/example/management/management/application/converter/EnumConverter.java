package org.example.management.management.application.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.example.management.management.domain.task.Task;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class EnumConverter implements AttributeConverter<List<Task.Tag>, String> {

    @Override
    public String convertToDatabaseColumn(List<Task.Tag> tags) {
        if (CollectionUtils.isEmpty(tags)) return null;
        return tags.stream().map(Enum::name).collect(Collectors.joining(","));
    }

    @Override
    public List<Task.Tag> convertToEntityAttribute(String dbData) {
        if (StringUtils.isEmpty(dbData)) return new ArrayList<>();
        return Arrays.stream(dbData.split(","))
                .map(Task.Tag::valueOf)
                .collect(Collectors.toList());
    }
}
