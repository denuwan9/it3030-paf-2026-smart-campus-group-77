package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.ResourceDTO;
import com.smartcampus.hub.entity.Facility;
import com.smartcampus.hub.entity.Resource;
import com.smartcampus.hub.repository.FacilityRepository;
import com.smartcampus.hub.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final FacilityRepository facilityRepository;

    @Transactional(readOnly = true)
    public List<ResourceDTO> getAllResources(com.smartcampus.hub.entity.ResourceStatus status, com.smartcampus.hub.entity.ResourceType type, String search) {
        return resourceRepository.findAllWithFacility().stream()
                .filter(r -> status == null || r.getStatus() == status)
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> search == null || r.getName().toLowerCase().contains(search.toLowerCase()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceDTO> getResourcesByFacilityId(UUID facilityId) {
        if (!facilityRepository.existsById(facilityId)) {
            throw new NoSuchElementException("Facility not found with id: " + facilityId);
        }
        return resourceRepository.findByFacilityId(facilityId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResourceDTO getResourceById(UUID id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + id));
        return mapToDTO(resource);
    }

    @Transactional
    public ResourceDTO createResource(UUID facilityId, ResourceDTO dto) {
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new NoSuchElementException("Facility not found with id: " + facilityId));

        Resource resource = Resource.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .type(dto.getType() != null ? dto.getType() : com.smartcampus.hub.entity.ResourceType.EQUIPMENT)
                .quantity(dto.getQuantity() != null ? dto.getQuantity() : 1)
                .status(dto.getStatus() != null ? dto.getStatus() : com.smartcampus.hub.entity.ResourceStatus.AVAILABLE)
                .facility(facility)
                .build();

        Resource saved = resourceRepository.save(resource);
        return mapToDTO(saved);
    }

    @Transactional
    public ResourceDTO updateResource(UUID id, ResourceDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + id));

        if (dto.getName() != null) resource.setName(dto.getName());
        if (dto.getDescription() != null) resource.setDescription(dto.getDescription());
        if (dto.getType() != null) resource.setType(dto.getType());
        if (dto.getQuantity() != null) resource.setQuantity(dto.getQuantity());
        if (dto.getStatus() != null) resource.setStatus(dto.getStatus());
        
        // Allow moving to a different facility
        if (dto.getFacilityId() != null && !dto.getFacilityId().equals(resource.getFacility().getId())) {
             Facility newFacility = facilityRepository.findById(dto.getFacilityId())
                     .orElseThrow(() -> new NoSuchElementException("Facility not found with id: " + dto.getFacilityId()));
             resource.setFacility(newFacility);
        }

        Resource updated = resourceRepository.save(resource);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteResource(UUID id) {
        if (!resourceRepository.existsById(id)) {
            throw new NoSuchElementException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Resource getResourceEntityById(UUID id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + id));
    }

    private ResourceDTO mapToDTO(Resource entity) {
        ResourceDTO.ResourceDTOBuilder builder = ResourceDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .type(entity.getType())
                .quantity(entity.getQuantity())
                .status(entity.getStatus());

        if (entity.getFacility() != null) {
            builder.facilityId(entity.getFacility().getId())
                    .facilityName(entity.getFacility().getName())
                    .location(entity.getFacility().getLocation())
                    .capacity(entity.getFacility().getCapacity());
        }

        return builder.build();
    }
}
