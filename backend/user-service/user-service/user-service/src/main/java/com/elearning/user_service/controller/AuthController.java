package com.elearning.user_service.controller;

import com.elearning.user_service.dto.AuthResponse;
import com.elearning.user_service.dto.CreateUserRequest;
import com.elearning.user_service.dto.LoginRequest;
import com.elearning.user_service.dto.UserDTO;
import com.elearning.user_service.service.AuthService;
import com.elearning.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        UserDTO user = authService.authenticate(request.getIdentifier(), request.getPassword());
        String token = authService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(user, token));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        String token = authService.generateToken(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(user, token));
    }

    @PostMapping("/validate/{token}")
    public ResponseEntity<UserDTO> validateToken(@PathVariable String token) {
        UserDTO user = authService.validateToken(token);
        return ResponseEntity.ok(user);
    }
}
