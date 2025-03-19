package org.example.management.management.infastructure.data.dao;

import lombok.RequiredArgsConstructor;
import org.example.management.management.infastructure.data.dto.ProjectDto;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProjectDaoImpl implements ProjectDao {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public ProjectDto getById(int id) {
        var result = jdbcTemplate.query(
                """
                        SELECT * FROM projects WHERE id = :id
                        """,
                new MapSqlParameterSource()
                        .addValue("id", id),
                BeanPropertyRowMapper.newInstance(ProjectDto.class)
        );

        return result.isEmpty() ? null : result.get(0);
    }
}
