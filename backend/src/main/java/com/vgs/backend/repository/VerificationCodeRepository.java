package com.vgs.backend.repository;

import com.vgs.backend.model.VerificationCode;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface VerificationCodeRepository extends MongoRepository<VerificationCode, String> {
    Optional<VerificationCode> findByEmail(String email);
}
