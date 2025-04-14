package org.example.management.management.infastructure.configuration;

import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.example.management.management.infastructure.exception.ErrorMessage;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Comparator;
import java.util.Map;

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@RestControllerAdvice
public class DefaultExceptionHandlerAdvice {

    @ExceptionHandler(ConstrainViolationException.class)
    public ResponseEntity<ErrorResponse> constrainViolationException(ConstrainViolationException exception) {
        String field = exception.getErrorMessage().getErrors().keySet().stream()
                .findFirst()
                .orElse(null);
        String message = exception.getErrorMessage().getErrors().entrySet().stream()
                .flatMap(entry -> entry.getValue().stream())
                .findFirst()
                .orElse(null);
        return ResponseEntity
                .status(UNPROCESSABLE_ENTITY)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(new ErrorResponse(field, message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgument(MethodArgumentNotValidException exception) {
        var fieldErrors = exception.getBindingResult().getFieldErrors()
                .stream()
                .sorted(Comparator.comparing(FieldError::getField))
                .toList();
        ErrorResponse errorResponse = null;
        for (var error : fieldErrors) {
            errorResponse = new ErrorResponse(error.getField(), error.getDefaultMessage());
            break;
        }
        return ResponseEntity
                .status(UNPROCESSABLE_ENTITY)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(errorResponse);
    }

    public ResponseEntity<ErrorMessage> sendError(HttpStatus status, ErrorMessage errorMessage) {
        return ResponseEntity.status(status)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(errorMessage);
    }

    public record ErrorResponse(
            String field,
            String message
    ) {

    }
}
