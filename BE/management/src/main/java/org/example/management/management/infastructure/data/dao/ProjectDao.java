package org.example.management.management.infastructure.data.dao;

import org.example.management.management.infastructure.data.dto.ProjectDto;

public interface ProjectDao {
    ProjectDto getById(int id);
}
