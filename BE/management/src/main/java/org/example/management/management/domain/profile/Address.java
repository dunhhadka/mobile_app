package org.example.management.management.domain.profile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.management.ddd.NestedDomainEvent;

@Getter
@Entity
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
}
