package com.vgs.backend.controller;

import com.vgs.backend.model.*;
import com.vgs.backend.repository.*;
import com.vgs.backend.service.EmailService;
import com.vgs.backend.util.JwtUtil;
import com.vgs.backend.util.PasswordHasher;
import com.vgs.backend.util.UniversityDomainMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Random;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final VerificationCodeRepository codeRepo;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final UniversityDomainMap universityDomainMap;

    public AuthController(UserRepository userRepo,
                          VerificationCodeRepository codeRepo,
                          EmailService emailService,
                          JwtUtil jwtUtil,
                          UniversityDomainMap universityDomainMap) {
        this.userRepo = userRepo;
        this.codeRepo = codeRepo;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.universityDomainMap = universityDomainMap;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestParam String first, @RequestParam String last,
                                        @RequestParam String email, @RequestParam String password,
                                        @RequestParam String university) {

        if (!email.endsWith(".edu"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Must use a .edu email");

        if (userRepo.findByEmail(email).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");

        String domain = email.substring(email.indexOf("@") + 1).toLowerCase();

        Set<String> validDomains = universityDomainMap.getUniversityDomainMap().get(university);
        if (validDomains == null || !validDomains.contains(domain)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email domain does not match selected university");
        }

        User user = new User();
        user.setFirstName(first);
        user.setLastName(last);
        user.setEmail(email);
        user.setUniversity(university);
        user.setPasswordHash(PasswordHasher.hash(password));
        user.setVerified(false);
        userRepo.save(user);

        
        return ResponseEntity.ok("Signup successful!");
    }

    @PostMapping("/vcode")
    public ResponseEntity<String> vcode(@RequestParam String email) {
        if (codeRepo.existsByEmail(email)) {
            codeRepo.deleteByEmail(email);
        }

        String code = String.format("%06d", new Random().nextInt(999999));
        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(code);
        vc.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        codeRepo.save(vc);

        //emailService.sendCode(email, code); //For dev this should be disabled

        return ResponseEntity.ok("Verification code sent to your email!");

    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam String email,
                                         @RequestParam String code) {
        VerificationCode vc = codeRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No code found"));

        if (!vc.getCode().equals(code))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid code");

        if (vc.getExpiresAt().isBefore(LocalDateTime.now())){
            codeRepo.delete(vc);
            return ResponseEntity.status(HttpStatus.GONE).body("Code expired");
        }
            

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
                                    
        User user = userRepo.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not verified", "redirect", "/verify", "email", email));
        }

        if (!PasswordHasher.matches(password, user.getPasswordHash()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}
