package com.example.demo.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // In a real app, you'd fetch the user from the database.
        // For now, we'll return a mock user with USER role.
        // If the email is 'admin@example.com', we'll give it the ADMIN role.
        
        String role = email.equals("admin@example.com") ? "ROLE_ADMIN" : "ROLE_USER";
        
        return new User(email, "", Collections.singletonList(new SimpleGrantedAuthority(role)));
    }
}
