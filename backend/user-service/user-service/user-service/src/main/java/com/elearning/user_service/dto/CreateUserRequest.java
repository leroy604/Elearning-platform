package com.elearning.user_service.dto;

import com.elearning.user_service.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {

    private String email;

    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private UserRole role;
}
