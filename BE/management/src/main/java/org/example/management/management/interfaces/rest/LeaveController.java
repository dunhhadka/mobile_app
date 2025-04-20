package org.example.management.management.interfaces.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.example.management.management.application.model.leaves.LeaveRequest;
import org.example.management.management.application.model.leaves.LeaveResponse;
import org.example.management.management.application.model.leaves.UpdateStatusLeaveRequest;
import org.example.management.management.application.model.leaves.UserAttendResponse;
import org.example.management.management.application.model.user.request.UpdateLeaveStatus;
import org.example.management.management.application.service.leaves.LeaveService;
import org.example.management.management.application.service.leaves.TaskDelegationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;
    private final TaskDelegationService delegationService;


    @PostMapping("/{userId}")
    public LeaveResponse createLeave(@Valid @RequestBody LeaveRequest leaveRequest,
                                     @PathVariable(name = "userId") Integer userId
    ) {
        int leaveId = this.leaveService.createLeave(leaveRequest, userId);
        return this.leaveService.getByIds(List.of(leaveId)).get(0);
    }

    @GetMapping("/all/{userId}")
    public List<LeaveResponse> getLeavesWithCurrentUser(
            @PathVariable(name = "userId") Integer userId
    ) {
        return leaveService.getLeavesWithCurrentUser(userId);
    }


    @PutMapping("/{leaveId}/user/{userId}")
    public LeaveResponse updateStatus(
            @PathVariable(name = "leaveId") Integer leaveId,
            @PathVariable(name = "userId") Integer userId,
            @RequestBody UpdateLeaveStatus leaveStatus
    ) {
        return leaveService.updateLeaveStatus(leaveId, userId, leaveStatus.status());
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


}
