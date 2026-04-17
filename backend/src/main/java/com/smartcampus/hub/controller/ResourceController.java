package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.ResourceDTO;
import com.smartcampus.hub.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<ApiResponse<List<ResourceDTO>>> getResourcesByFacilityId(@PathVariable UUID facilityId) {
        return ResponseEntity.ok(ApiResponse.success("Resources fetched successfully", resourceService.getResourcesByFacilityId(facilityId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDTO>> getResourceById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Resource fetched successfully", resourceService.getResourceById(id)));
    }

    @PostMapping("/facility/{facilityId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDTO>> createResource(@PathVariable UUID facilityId, @RequestBody ResourceDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Resource created successfully", resourceService.createResource(facilityId, dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDTO>> updateResource(@PathVariable UUID id, @RequestBody ResourceDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", resourceService.updateResource(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable UUID id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully", null));
    }
}
