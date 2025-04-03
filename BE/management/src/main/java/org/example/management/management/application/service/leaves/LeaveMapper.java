package org.example.management.management.application.service.leaves;

import org.example.management.management.application.model.leaves.LeaveResponse;
import org.example.management.management.domain.leaves.Leave;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class LeaveMapper {
    public abstract LeaveResponse toLeaveResponse(Leave leave);
}
