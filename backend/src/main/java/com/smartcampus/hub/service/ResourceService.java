package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.CreateResourceRequest;
import com.smartcampus.hub.dto.ResourceResponse;
import com.smartcampus.hub.dto.UpdateResourceRequest;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.entity.ResourceStatus;
import com.smartcampus.hub.entity.ResourceType;
import com.smartcampus.hub.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Transactional
    public ResourceResponse createResource(CreateResourceRequest request) {
        validateAvailabilityWindow(request.getAvailabilityStart(), request.getAvailabilityEnd());

        Resource resource = Resource.builder()
                .name(request.getName().trim())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation().trim())
                .availabilityStart(request.getAvailabilityStart())
                .availabilityEnd(request.getAvailabilityEnd())
                .status(request.getStatus() == null ? ResourceStatus.ACTIVE : request.getStatus())
                .description(request.getDescription())
                .build();

        return toResponse(resourceRepository.save(resource));
    }

    @Transactional
    public ResourceResponse updateResource(UUID resourceId, UpdateResourceRequest request) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            resource.setName(request.getName().trim());
        }
        if (request.getType() != null) {
            resource.setType(request.getType());
        }
        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }
        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            resource.setLocation(request.getLocation().trim());
        }
        if (request.getStatus() != null) {
            resource.setStatus(request.getStatus());
        }
        if (request.getDescription() != null) {
            resource.setDescription(request.getDescription());
        }

        LocalTime start = request.getAvailabilityStart() != null
                ? request.getAvailabilityStart()
                : resource.getAvailabilityStart();
        LocalTime end = request.getAvailabilityEnd() != null
                ? request.getAvailabilityEnd()
                : resource.getAvailabilityEnd();
        validateAvailabilityWindow(start, end);
        resource.setAvailabilityStart(start);
        resource.setAvailabilityEnd(end);

        return toResponse(resourceRepository.save(resource));
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> searchResources(ResourceType type,
                                                  Integer minCapacity,
                                                  String location,
                                                  ResourceStatus status,
                                                  String search) {
        return resourceRepository.searchResources(type, status, minCapacity, normalizeParam(location), normalizeParam(search))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Resource getResourceEntityById(UUID resourceId) {
        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    private String normalizeParam(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private void validateAvailabilityWindow(LocalTime start, LocalTime end) {
        if (!start.isBefore(end)) {
            throw new RuntimeException("Availability start time must be before end time");
        }
    }

    private ResourceResponse toResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityStart(resource.getAvailabilityStart())
                .availabilityEnd(resource.getAvailabilityEnd())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}