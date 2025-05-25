package com.vgs.backend.controller;

import com.vgs.backend.model.User;
import com.vgs.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class PublicUserController {

    private final UserRepository userRepo;

    public PublicUserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/{email}")
    public PublicUserDto getPublicUser(@PathVariable String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new PublicUserDto(
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getUniversity()
        );
    }

    public static class PublicUserDto {
        private final String firstName;
        private final String lastName;
        private final String email;
        private final String university;

        public PublicUserDto(String firstName, String lastName, String email, String university) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.university = university;
        }

        public String getFirstName() { return firstName; }
        public String getLastName()  { return lastName; }
        public String getEmail()     { return email; }
        public String getUniversity(){ return university; }
    }
}