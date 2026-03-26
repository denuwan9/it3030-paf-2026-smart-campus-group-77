package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserRegistrationDto {

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name must only contain alphabetical characters and spaces")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@(my\\.)?sliit\\.lk$", message = "Only SLIIT campus members can join this hub!")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$", 
             message = "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character")
    private String password;
}
