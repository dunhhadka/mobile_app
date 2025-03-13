package org.example.management.management.domain.profile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.management.ddd.NestedDomainEvent;
import org.example.management.management.application.model.user.request.UserRequest;

@Getter
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
public class Address extends NestedDomainEvent<User> {

    @ManyToOne
    @JsonIgnore
    @Setter
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User aggRoot;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Integer wardId;

    private String wardCode;

    private String wardName;

    private Integer districtId;

    private String districtCode;

    private String districtName;

    private String countryId;

    private String countryCode;

    private String countryName;

    @Override
    protected User getAggRoot() {
        return null;
    }

    public void update(UserRequest.AddressRequest addressUpdatable) {
        this.wardName = addressUpdatable.getWardName();
        this.districtName = addressUpdatable.getDistrictName();
        this.countryName = addressUpdatable.getCountryName();
    }
}
