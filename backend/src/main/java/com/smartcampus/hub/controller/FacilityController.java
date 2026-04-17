package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ApiResponse;
import com.smartcampus.hub.dto.FacilityDTO;
import com.smartcampus.hub.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityDTO>>> getAllFacilities() {
        return ResponseEntity.ok(ApiResponse.success("Facilities fetched successfully", facilityService.getAllFacilities()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityDTO>> getFacilityById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Facility fetched successfully", facilityService.getFacilityById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<FacilityDTO>> createFacility(@RequestBody FacilityDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Facility created successfully", facilityService.createFacility(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<FacilityDTO>> updateFacility(@PathVariable UUID id, @RequestBody FacilityDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Facility updated successfully", facilityService.updateFacility(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFacility(@PathVariable UUID id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok(ApiResponse.success("Facility deleted successfully", null));
    }
}
