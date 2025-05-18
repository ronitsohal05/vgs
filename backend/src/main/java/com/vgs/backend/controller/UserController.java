package com.vgs.backend.controller;

import com.vgs.backend.model.User;
import com.vgs.backend.repository.UserRepository;
import com.vgs.backend.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public UserController(JwtUtil jwtUtil, UserRepository userRepo) {
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @GetMapping
    public User getUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.validateTokenAndGetEmail(token);
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
