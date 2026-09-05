package vn.edu.crs.authservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.edu.crs.authservice.dto.ApiKeyCreateRequestDTO;
import vn.edu.crs.authservice.dto.ApiKeyResponseDTO;
import vn.edu.crs.authservice.service.ApiKeyService;

import java.util.List;

@RestController
@RequestMapping("/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping
    public ResponseEntity<List<ApiKeyResponseDTO>> getAll() {
        return ResponseEntity.ok(
                apiKeyService.getAll()
        );
    }

    @PostMapping
    public ResponseEntity<ApiKeyResponseDTO> create(
            @RequestBody ApiKeyCreateRequestDTO request
    ) {
        return ResponseEntity.ok(
                apiKeyService.create(request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revoke(
            @PathVariable Long id
    ) {
        apiKeyService.revoke(id);

        return ResponseEntity.noContent().build();
    }
}