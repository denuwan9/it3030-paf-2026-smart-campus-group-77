package com.example.demo.dto;

/**
 * Generic API response wrapper used across all endpoints for consistent
 * success / failure messaging.
 *
 * @param success {@code true} if the operation succeeded
 * @param message human-readable description of the outcome
 * @param data    optional payload (may be {@code null} for void operations)
 */
public record ApiResponse<T>(
        boolean success,
        String message,
        T data
) {
    /** Convenience factory for successful responses with a payload. */
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    /** Convenience factory for successful responses with no payload (data = null). */
    public static ApiResponse<Void> ok(String message) {
        return new ApiResponse<>(true, message, null);
    }

    /** Convenience factory for error responses. */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}

