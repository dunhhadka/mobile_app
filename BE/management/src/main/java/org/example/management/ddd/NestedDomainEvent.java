package org.example.management.ddd;

public abstract class NestedDomainEvent<R extends AggregateRoot<R>> extends DomainEntity<R> {
    protected abstract R getAggRoot();

    protected void addDomainEvent(DomainEvent event) {
        assert getAggRoot() != null : "require root";

        this.getAggRoot().addDomainEvent(event);
    }
}
