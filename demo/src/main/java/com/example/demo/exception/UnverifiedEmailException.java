package com.example.demo.exception;

public class UnverifiedEmailException extends RuntimeException {
    public UnverifiedEmailException(String message) {
        super(message);
    }
}
