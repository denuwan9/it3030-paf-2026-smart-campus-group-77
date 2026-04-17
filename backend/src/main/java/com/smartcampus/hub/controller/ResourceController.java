package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import com.smartcampus.hub.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getResources(
            @RequestParam(name = "type", required = false) ResourceType type,
            @RequestParam(name = "minCapacity", required = false) Integer minCapacity,
            @RequestParam(name = "location", required = false) String location,
            @RequestParam(name = "status", required = false) ResourceStatus status,
            @RequestParam(name = "search", required = false) String search
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Resources fetched successfully",
                resourceService.searchResources(type, minCapacity, location, status, search)
        ));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(@Valid @RequestBody CreateResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", resourceService.createResource(request)));
    }

    @PutMapping("/{resourceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(@PathVariable UUID resourceId,
                                                                        @Valid @RequestBody UpdateResourceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", resourceService.updateResource(resourceId, request)));
    }
}