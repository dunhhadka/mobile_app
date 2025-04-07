package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.leaves.LeaveRequest;
import org.example.management.management.application.model.leaves.LeaveResponse;
import org.example.management.management.application.model.leaves.UpdateStatusLeaveRequest;
import org.example.management.management.application.model.leaves.UserAttendResponse;
import org.example.management.management.application.service.leaves.LeaveService;
import org.example.management.management.application.service.leaves.TaskDelegationService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;
    private final TaskDelegationService delegationService;

    @GetMapping("/{taskId}/delegation-candidates")
    public List<UserAttendResponse> getTaskDelegationCandidates(@PathVariable int taskId) {
        return delegationService.getTaskDelegationCandidates(taskId);
    }


    @PostMapping("/{userId}/{taskId}")
    public LeaveResponse createLeave(@Valid @RequestBody LeaveRequest leaveRequest,
                                     @PathVariable(name = "userId") Integer userId,
                                     @PathVariable(name = "taskId")  Integer taskId
                                     ) {
        int leaveId = this.leaveService.createLeave(leaveRequest, taskId, userId);
        return this.leaveService.getByIds(List.of(leaveId)).get(0);
    }

    @PutMapping("/{leaveId}")
    public LeaveResponse updateLeave(@Min(1) @PathVariable(name = "leaveId") int leaveId,
                                     @Valid @RequestBody LeaveRequest request
                                     ) {
        this.leaveService.updateLeave(leaveId, request);
        return this.leaveService.getByIds(List.of(leaveId)).get(0);
    }

    @GetMapping("/{leaveId}")
    public LeaveResponse getByLeaveId(@Min(1) @PathVariable(name = "leaveId") int leaveId
                                      ) {
        return this.leaveService.getByIds(List.of(leaveId)).get(0);
    }

    @DeleteMapping("/{leaveId}")
    public LeaveResponse deleteLeave(@Min(1) @PathVariable(name = "leaveId") int leaveId) {
        return null;
    }

    @PutMapping("/update-status/{leaveId}")
    public LeaveResponse updateLeaveStatus(@Min(1) @PathVariable(name = "leaveId") int leaveId, @Valid @RequestBody UpdateStatusLeaveRequest request
                                           ) {
        return this.leaveService.updateLeaveStatus(leaveId, request);
    }

}
