package com.vgs.backend.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

@Service
public class S3Service {
    private final S3Client s3;
    private final String bucket;

    public S3Service(
        @Value("${aws.region}") String region,
        @Value("${aws.accessKeyId}") String accessKey,
        @Value("${aws.secretAccessKey}") String secretKey,
        @Value("${aws.s3.bucket}") String bucket
    ) {
        this.bucket = bucket;
        this.s3 = S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .build();
    }

    public String uploadFile(MultipartFile file, String key) {
        try {
            PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                // .acl(ObjectCannedACL.PUBLIC_READ)   ← remove this line
                .contentType(file.getContentType())
                .build();

            s3.putObject(req,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("https://%s.s3.amazonaws.com/%s", bucket, key);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not upload file", e);
        }
    }

    public void deleteFile(String key) {
        s3.deleteObject(DeleteObjectRequest.builder()
                              .bucket(bucket)
                              .key(key)
                              .build());
    }
}
