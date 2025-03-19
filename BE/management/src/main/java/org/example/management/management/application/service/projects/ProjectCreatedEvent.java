package org.example.management.management.application.service.projects;

import org.apache.commons.lang3.tuple.Pair;

import java.util.List;

public record ProjectCreatedEvent(int projectId, UserInProjectInfo userInProjectInfo) {
}
