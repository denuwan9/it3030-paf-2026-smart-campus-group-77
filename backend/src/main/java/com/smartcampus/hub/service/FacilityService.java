package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.FacilityDTO;
import com.smartcampus.hub.entity.Facility;
import com.smartcampus.hub.repository.BookingRepository;
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
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public String uploadFacilityImage(UUID id, org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Facility not found with id: " + id));
        
        String url = cloudinaryService.uploadImage(file, "facilities");
        facility.setImageUrl(url);
        facilityRepository.save(facility);
        return url;
    }

    @Transactional(readOnly = true)
    public List<FacilityDTO> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FacilityDTO getFacilityById(UUID id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Facility not found with id: " + id));
        return mapToDTO(facility);
    }

    @Transactional
    public FacilityDTO createFacility(FacilityDTO dto) {
        Facility facility = Facility.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .capacity(dto.getCapacity())
                .status(dto.getStatus() != null ? dto.getStatus() : com.smartcampus.hub.entity.FacilityStatus.AVAILABLE)
                .imageUrl(dto.getImageUrl())
                .build();
        Facility saved = facilityRepository.save(facility);
        return mapToDTO(saved);
    }

    @Transactional
    public FacilityDTO updateFacility(UUID id, FacilityDTO dto) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Facility not found with id: " + id));

        if (dto.getName() != null) facility.setName(dto.getName());
        if (dto.getDescription() != null) facility.setDescription(dto.getDescription());
        if (dto.getLocation() != null) facility.setLocation(dto.getLocation());
        if (dto.getCapacity() != null) facility.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null) facility.setStatus(dto.getStatus());
        if (dto.getImageUrl() != null) facility.setImageUrl(dto.getImageUrl());

        Facility updated = facilityRepository.save(facility);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteFacility(UUID id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Facility not found with id: " + id));

        // Manually delete associated bookings for all resources in this facility
        // This is necessary because Resource -> Booking doesn't have cascade delete enabled
        facility.getResources().forEach(resource -> {
            List<com.smartcampus.hub.entity.Booking> bookings = bookingRepository.findAllBookings(null, resource.getId(), null, null, null);
            if (!bookings.isEmpty()) {
                bookingRepository.deleteAll(bookings);
            }
        });

        facilityRepository.delete(facility);
    }

    private FacilityDTO mapToDTO(Facility entity) {
        return FacilityDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .location(entity.getLocation())
                .capacity(entity.getCapacity())
                .status(entity.getStatus())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}
