package com.vgs.backend.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vgs.backend.repository.PasswordResetCodeRepository;
import com.vgs.backend.repository.VerificationCodeRepository;

@Service
public class CodeCleanupService {
    private final VerificationCodeRepository vCodeRepo;
    private final PasswordResetCodeRepository pCodeRepo;

    public CodeCleanupService(VerificationCodeRepository vCodeRepo, PasswordResetCodeRepository pCodeRepo) {
        this.vCodeRepo = vCodeRepo;
        this.pCodeRepo = pCodeRepo;
    }

    @Scheduled(fixedRate = 3600000) // every 1 hour
    public void cleanupExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        vCodeRepo.deleteByExpiresAtBefore(now);
        pCodeRepo.deleteByExpiresAtBefore(now);
    }
    
}
