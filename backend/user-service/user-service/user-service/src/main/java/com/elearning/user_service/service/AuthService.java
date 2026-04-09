package com.elearning.user_service.service;

import com.elearning.user_service.dto.UserDTO;
import com.elearning.user_service.entity.UserEntity;
import com.elearning.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Value("${jwt.secret:your-super-secret-jwt-key-change-in-production-2026}")
    private String jwtSecret;

    public UserDTO authenticate(String identifier, String password) {
        UserEntity user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email/username or password"));

        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid email/username or password");
        }

        if (!user.getEnabled()) {
            throw new IllegalArgumentException("User account is disabled");
        }

        return mapToDTO(user);
    }

    public String generateToken(UserDTO user) {
        String tokenPayload = user.getId() + ":" + user.getEmail() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(tokenPayload.getBytes());
    }

    public UserDTO validateToken(String token) {
        try {
            String decodedToken = new String(Base64.getDecoder().decode(token));
            String[] parts = decodedToken.split(":");

            if (parts.length < 2) {
                throw new IllegalArgumentException("Invalid token format");
            }

            Long userId = Long.parseLong(parts[0]);
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            return mapToDTO(user);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }

    private UserDTO mapToDTO(UserEntity user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
