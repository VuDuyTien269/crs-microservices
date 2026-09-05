package vn.edu.crs.courseservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =====================================================
    // 1. KHÔNG TÌM THẤY - HTTP 404
    // =====================================================
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(
            NoSuchElementException ex) {

        Map<String, String> map = new HashMap<>();

        map.put("message", ex.getMessage());

        return map;
    }

    // =====================================================
    // 2. DỮ LIỆU KHÔNG HỢP LỆ - HTTP 400
    // =====================================================
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleBadRequest(
            IllegalArgumentException ex) {

        Map<String, String> map = new HashMap<>();

        map.put("message", ex.getMessage());

        return map;
    }

    // =====================================================
    // 3. VALIDATION DTO - HTTP 400
    // =====================================================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return errors;
    }

    // =====================================================
    // 4. HẾT CHỖ / KHÔNG THỂ THỰC HIỆN - HTTP 409
    // =====================================================
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleConflict(
            IllegalStateException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        Map.of(
                                "message",
                                ex.getMessage()
                        )
                );
    }
}
