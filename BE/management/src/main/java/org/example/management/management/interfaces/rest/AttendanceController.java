package org.example.management.management.interfaces.rest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    @PostMapping
    public String test() {
        return "test attendances";
    }
}
