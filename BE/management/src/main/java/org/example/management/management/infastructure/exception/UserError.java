package org.example.management.management.infastructure.exception;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserError {
    private String code;
    private String message;
    private List<String> fields;

    @Override
    public String toString() {
        return "UserError{" +
                "code='" + code + '\'' +
                ", message='" + message + '\'' +
                ", fields=" + fields +
                '}';
    }
}
