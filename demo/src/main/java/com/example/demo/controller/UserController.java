package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.entity.UserPreferences;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }

    @PostMapping("/preferences")
    public UserPreferences createPreferences(Authentication authentication, @Valid @RequestBody UserPreferences preferences) {
        String email = authentication.getName();
        return userService.saveUserPreferences(email, preferences);
    }
}
