package org.example.management.management.application.model.user.response;

import lombok.*;
import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.domain.profile.User;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private int id;

    private String companyId;

    private LocalDate dateOfBirth;

    private String firstName;

    private String lastName;

    private String phone;

    private String email;

    private String userName;

    private User.Position position;

    private User.Role role;

    private AddressResponse address;

    private ImageResponse avatar;

    private String defaultColor;

    @Getter
    @Setter
    public static class AddressResponse {
        private int id;
        private String wardName;
        private String districtName;
        private String countryName;
    }
}
