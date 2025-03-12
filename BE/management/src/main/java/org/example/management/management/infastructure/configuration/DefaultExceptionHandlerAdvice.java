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

import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@RestControllerAdvice
public class DefaultExceptionHandlerAdvice {

    @ExceptionHandler(ConstrainViolationException.class)
    public ResponseEntity<ErrorMessage> constrainViolationException(ConstrainViolationException exception) {
        return sendError(UNPROCESSABLE_ENTITY, exception.getErrorMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorMessage> handleMethodArgument(MethodArgumentNotValidException exception) {
        var fieldErrors = exception.getBindingResult().getFieldErrors()
                .stream()
                .sorted(Comparator.comparing(FieldError::getField))
                .toList();
        var errorMessageBuilder = ErrorMessage.builder();
        for (var error : fieldErrors) {
            errorMessageBuilder.addError(error.getField(), error.getDefaultMessage());
        }
        return sendError(HttpStatus.BAD_REQUEST, errorMessageBuilder.build());
    }

    public ResponseEntity<ErrorMessage> sendError(HttpStatus status, ErrorMessage errorMessage) {
        return ResponseEntity.status(status)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(errorMessage);
    }
}
