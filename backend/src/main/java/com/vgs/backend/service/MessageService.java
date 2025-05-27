package com.vgs.backend.service;

import com.vgs.backend.model.Message;
import com.vgs.backend.model.User;
import com.vgs.backend.repository.MessageRepository;
import com.vgs.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository msgRepo;
    private final UserRepository userRepo;

    public MessageService(MessageRepository msgRepo, UserRepository userRepo) {
        this.msgRepo = msgRepo;
        this.userRepo = userRepo;
    }

    public Message sendMessage(String senderId, String recipientId, String text) {
        Message m = new Message();
        m.setSenderId(senderId);
        m.setRecipientId(recipientId);
        m.setText(text);
        m.setSentAt(Instant.now());
        return msgRepo.save(m);
    }

    public List<Message> getConversation(String me, String other) {
        // you could also declare a custom repo method, but this will work:
        return msgRepo.findAll().stream()
            .filter(m ->
                (m.getSenderId().equals(me)     && m.getRecipientId().equals(other)) ||
                (m.getSenderId().equals(other)  && m.getRecipientId().equals(me))
            )
            .sorted(Comparator.comparing(Message::getSentAt))
            .collect(Collectors.toList());
    }

    public List<ThreadDto> getThreads(String me) {
        List<Message> all = msgRepo.findBySenderIdOrRecipientId(me, me);
        Map<String, Message> lastByOther = new HashMap<>();
        for (Message m : all) {
            String other = m.getSenderId().equals(me) ? m.getRecipientId() : m.getSenderId();
            lastByOther.compute(other, (k, prev) ->
                prev == null || m.getSentAt().isAfter(prev.getSentAt()) ? m : prev
            );
        }

        return lastByOther.entrySet().stream().map(e -> {
            String otherId = e.getKey();
            Message lastMsg = e.getValue();
            User otherUser = userRepo.findByEmail(otherId)
                                     .orElseThrow(() -> new RuntimeException("User not found"));
            return new ThreadDto(
                otherId,
                otherUser.getFirstName() + " " + otherUser.getLastName(),
                lastMsg.getText(),
                lastMsg.getSentAt()
            );
        }).collect(Collectors.toList());
    }

    /** Simple DTO for the thread list */
    public static class ThreadDto {
        public final String userId;
        public final String name;
        public final String lastMessage;
        public final Instant lastAt;

        public ThreadDto(String userId, String name, String lastMessage, Instant lastAt) {
            this.userId = userId;
            this.name = name;
            this.lastMessage = lastMessage;
            this.lastAt = lastAt;
        }
    }
}
