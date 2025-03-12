package org.example.management.management.domain.profile;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.example.management.ddd.AggregateRoot;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.Instant;
import java.util.List;

@Getter
@Entity
@Table(name = "users")
public class User extends AggregateRoot<User> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Size(max = 255)
    private String firstName;
    @Size(max = 255)
    private String lastName;
    @Size(max = 255)
    private String userName;

    private Instant dataOfBirth;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Position position;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private Role role;

    @Size(max = 255)
    private String email;

    private String password;

    private String phone;

    private Integer companyId;

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(mappedBy = "aggRoot", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Address> address;

    private String image;

    public enum Position {
        dev
    }

    public enum Role {
        manager,
        member
    }
}
