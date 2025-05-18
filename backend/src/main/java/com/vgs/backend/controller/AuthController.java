package com.vgs.backend.controller;

import com.vgs.backend.model.*;
import com.vgs.backend.repository.*;
import com.vgs.backend.service.EmailService;
import com.vgs.backend.util.JwtUtil;
import com.vgs.backend.util.PasswordHasher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Random;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final VerificationCodeRepository codeRepo;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo,
                          VerificationCodeRepository codeRepo,
                          EmailService emailService,
                          JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.codeRepo = codeRepo;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestParam String email,
                                         @RequestParam String password,
                                         @RequestParam String university) {
        if (!email.endsWith(".edu"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Must use a .edu email");

        if (userRepo.findByEmail(email).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");

        User user = new User();
        user.setEmail(email);
        user.setUniversity(university);
        user.setPasswordHash(PasswordHasher.hash(password));
        user.setVerified(false);
        userRepo.save(user);

        String code = String.format("%06d", new Random().nextInt(999999));
        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(code);
        vc.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        codeRepo.save(vc);

        emailService.sendCode(email, code);

        return ResponseEntity.ok("Signup successful. Check your email for a verification code.");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam String email,
                                         @RequestParam String code) {
        VerificationCode vc = codeRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No code found"));

        if (!vc.getCode().equals(code))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid code");

        if (vc.getExpiresAt().isBefore(LocalDateTime.now()))
            return ResponseEntity.status(HttpStatus.GONE).body("Code expired");

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        userRepo.save(user);
        codeRepo.delete(vc);

        return ResponseEntity.ok("Email verified. You can now log in.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email,
                                   @RequestParam String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified())
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Email not verified");

        if (!PasswordHasher.matches(password, user.getPasswordHash()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}
