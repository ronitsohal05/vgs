package com.vgs.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String hello() {
        return "Hello from Spring Boot!";
    }
}
