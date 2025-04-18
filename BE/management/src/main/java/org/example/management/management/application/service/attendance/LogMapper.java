package org.example.management.management.application.service.attendance;

import org.example.management.management.application.model.attendance.AttendanceResponse;
import org.example.management.management.application.model.attendance.LogResponse;
import org.example.management.management.domain.attendace.Attendance;
import org.example.management.management.domain.attendace.Log;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.task.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class LogMapper {

    @Mapping(target = "id", source = "log.id")
    public abstract LogResponse toResponse(Log log);
    public abstract List<LogResponse> toResponses(List<Log> logs);
    public abstract AttendanceResponse toResponse(Attendance attendance);
}
