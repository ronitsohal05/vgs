package com.vgs.backend.repository;

import com.vgs.backend.model.PasswordResetCode;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PasswordResetCodeRepository extends MongoRepository<PasswordResetCode, String> {
    Optional<PasswordResetCode> findByCode(String code);
    Optional<PasswordResetCode> findByEmail(String email);
    void deleteByEmail(String email);
}

