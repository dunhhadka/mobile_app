package org.example.management.management.application.service.projects;

import java.util.List;

public record UserInProjectInfo(List<Integer> removeIds, List<Integer> addIds) {
}
