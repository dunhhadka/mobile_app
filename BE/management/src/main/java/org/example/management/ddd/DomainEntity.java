package org.example.management.ddd;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Transient;

@MappedSuperclass
public abstract class DomainEntity<R extends AggregateRoot<R>> {

    @Transient
    private boolean isNew;

    @JsonIgnore
    public boolean isNew() {
        return isNew;
    }

    @PostPersist
    @PostLoad
    private void markNotNew() {
        this.isNew = false;
    }
}
