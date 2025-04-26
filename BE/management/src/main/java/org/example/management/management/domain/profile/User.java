package org.example.management.management.domain.profile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.example.management.ddd.AggregateRoot;
import org.example.management.management.application.model.user.request.UserRequest;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Slf4j
@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends AggregateRoot<User> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "manager_id")
    private Integer managerId;

    @Size(max = 255)
    private String firstName;
    @Size(max = 255)
    private String lastName;
    @Size(max = 255)
    private String userName;

    private LocalDate dateOfBirth;

    @Enumerated(value = EnumType.STRING)
    private Position position;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Role role;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    private String password;

    private String phone;

    @Column(name = "company_id")
    private Integer companyId;

    private Integer avatarId;

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(mappedBy = "aggRoot", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    private String image;

    private String defaultColor;

    public void updateAddress(int addressId, UserRequest.AddressRequest request) {
        if (CollectionUtils.isEmpty(this.addresses) || addressId == 0) {
            this.addAddress(request);
            return;
        }
        var address = this.addresses.stream()
                .filter(a -> Objects.equals(a.getId(), addressId))
                .findFirst()
                .orElse(null);
        if (address == null) {
            log.error("Address not found with id = {}", addressId);
            return;
        }

        address.update(request);
    }

    public void addAddress(UserRequest.AddressRequest addressRequest) {
        if (addressRequest == null) {
            this.removeAddresses();
            return;
        }
        if (this.addresses == null) this.addresses = new ArrayList<>();
        var address = Address.builder()
                .wardName(addressRequest.getWardName())
                .districtName(addressRequest.getDistrictName())
                .countryName(addressRequest.getCountryName())
                .build();
        address.setAggRoot(this);
        this.addresses.add(address);
    }

    public void updateAddress(UserRequest.AddressRequest address) {
        if (address != null) {
            int addressId = CollectionUtils.isEmpty(this.addresses)
                    ? 0 : this.addresses.get(0).getId();
            this.updateAddress(addressId, address);
            return;
        }
        this.removeAddresses();
    }

    private void removeAddresses() {
        if (CollectionUtils.isEmpty(this.addresses)) return;
        this.addresses.forEach(add -> add.setAggRoot(null));
        this.addresses.clear();
    }


    public enum Position {
        dev,
        tester,
        designer,
        analyst,
        manager,
        other
    }

    public enum Role {
        manager,
        member
    }
}
