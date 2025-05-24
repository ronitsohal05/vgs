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
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final VerificationCodeRepository vCodeRepo;
    private final PasswordResetCodeRepository pCodeRepo;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final UniversityDomainMap universityDomainMap;

    public AuthController(UserRepository userRepo,
                          VerificationCodeRepository vCodeRepo,
                          PasswordResetCodeRepository pCodeRepo,
                          EmailService emailService,
                          JwtUtil jwtUtil,
                          UniversityDomainMap universityDomainMap) {
        this.userRepo = userRepo;
        this.vCodeRepo = vCodeRepo;
        this.pCodeRepo = pCodeRepo;
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
        user.setPofilePictureLink("/src/assets/default_profile.png");
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
        Optional<VerificationCode> existing = vCodeRepo.findByEmail(email);

        if (existing.isPresent()) {
            VerificationCode oldCode = existing.get();
            if (oldCode.getLastSentAt() != null &&
                oldCode.getLastSentAt().isAfter(LocalDateTime.now().minusSeconds(60))) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Please wait 60 seconds before requesting another code.");
            }
            vCodeRepo.delete(oldCode);
        }

        String code = String.format("%06d", new Random().nextInt(999999));
        VerificationCode vc = new VerificationCode();
        vc.setEmail(email);
        vc.setCode(code);
        vc.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        vc.setLastSentAt(LocalDateTime.now());
        vCodeRepo.save(vc);

        //emailService.sendVerificationCode(email, code); //For dev this should be disabled

        return ResponseEntity.ok("Verification code sent to your email!");

    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam String email,
                                         @RequestParam String code) {
        VerificationCode vc = vCodeRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No code found"));

        if (!vc.getCode().equals(code))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid code");

        if (vc.getExpiresAt().isBefore(LocalDateTime.now())){
            vCodeRepo.delete(vc);
            return ResponseEntity.status(HttpStatus.GONE).body("Code expired");
        }
            

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        userRepo.save(user);
        vCodeRepo.delete(vc);

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

        String token = jwtUtil.generateToken(email, user.getUniversity());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<PasswordResetCode> existingCode = pCodeRepo.findByEmail(email);

        if (existingCode.isPresent()) {
            PasswordResetCode prc = existingCode.get();
            if (prc.getLastSentAt() != null &&
                prc.getLastSentAt().isAfter(LocalDateTime.now().minusSeconds(60))) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body("Please wait 60 seconds before requesting another reset link.");
            }
            pCodeRepo.delete(prc);
        }

        String token = UUID.randomUUID().toString();
        PasswordResetCode resetCode = new PasswordResetCode();
        resetCode.setEmail(email);
        resetCode.setCode(token);
        resetCode.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        resetCode.setLastSentAt(LocalDateTime.now());
        pCodeRepo.save(resetCode);

        // emailService.sendResetPasswordCode(email, "http://localhost:5173/reset-password?token=" + token); // for dev disable

        return ResponseEntity.ok("Reset link sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String code, @RequestParam String newPassword) {
        PasswordResetCode prt = pCodeRepo.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Invalid code"));

        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.GONE).body("Code expired");
        }

        User user = userRepo.findByEmail(prt.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPasswordHash(PasswordHasher.hash(newPassword));
        userRepo.save(user);
        pCodeRepo.delete(prt);

        return ResponseEntity.ok("Password reset successful");
    }
}
