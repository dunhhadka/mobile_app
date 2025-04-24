package org.example.management.management.application.model.user.request;

import lombok.Getter;
import lombok.Setter;
import org.example.management.management.application.model.PageRequest;

import java.util.List;

@Getter
@Setter
public class UserFilterRequest extends PageRequest {
    private List<Integer> ids;

    private Integer projectId;
}
