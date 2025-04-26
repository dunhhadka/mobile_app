package org.example.management.management.application.model.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.management.management.domain.profile.User;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
    @Email(message = "email invalid format")
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "phone invalid format")
    private String phone;

    private Integer companyId;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private User.Position position;

    private String password;

    private AddressRequest address;

    private String defaultColor;

    private Integer managerId;
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressRequest {
        private String wardName;
        private String districtName;
        private String countryName;
    }
}
