package com.vgs.backend.repository;

import com.vgs.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findBySenderIdAndRecipientIdOrSenderIdAndRecipientId(
        String senderId1, String recipientId1,
        String senderId2, String recipientId2
    );

    List<Message> findBySenderIdOrRecipientId(String senderId, String recipientId);
}