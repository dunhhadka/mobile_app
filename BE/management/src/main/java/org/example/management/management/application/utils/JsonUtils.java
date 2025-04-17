package org.example.management.management.application.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class JsonUtils {

    private static final ObjectMapper objectMapper;

    static {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        // TODO: config
    }

    /**
     * write object to string
     *
     * @Param object
     * @Return string
     */
    public static <T> String marshal(T object) throws JsonProcessingException {
        return objectMapper.writeValueAsString(object);
    }

    /**
     * read data to object
     *
     * @Param data: string
     * @Param clazz : Target Class
     * @Return Object<> type of Class
     */
    public static <T> T unmarshal(String data, Class<T> clazz) throws JsonProcessingException {
        return objectMapper.readValue(data, clazz);
    }
}
