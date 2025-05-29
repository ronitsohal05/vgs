package com.vgs.backend.controller;

import com.vgs.backend.model.Message;
import com.vgs.backend.service.MessageService;
import com.vgs.backend.util.JwtUtil;

import io.jsonwebtoken.Claims;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageSvc;
    private final JwtUtil jwtUtil;

    public MessageController(MessageService messageSvc, JwtUtil jwtUtil) {
        this.messageSvc = messageSvc;
        this.jwtUtil = jwtUtil;
    }

    private String extractEmail(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.validateTokenAndGetEmail(token);
    }

    @PostMapping("/{recipientId}")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageDto send(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable String recipientId,
        @RequestBody MessageRequest req
    ) {
        String senderId = extractEmail(authHeader);
        Message sent = messageSvc.sendMessage(senderId, recipientId, req.getText());
        return MessageDto.from(sent);
    }

    @GetMapping("/with/{otherUserId}")
    public List<MessageDto> convo(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable String otherUserId
    ) {
        String me = extractEmail(authHeader);
        return messageSvc.getConversation(me, otherUserId).stream()
                         .map(MessageDto::from)
                         .collect(Collectors.toList());
    }

    @GetMapping("/threads")
    public List<ThreadDto> listThreads(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String email = claims.getSubject();
        return messageSvc.getThreads(email).stream()
                         .map(ThreadDto::from)
                         .collect(Collectors.toList());
    }

    // ---- DTOs ----

    public static class MessageRequest {
        private String text;
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class MessageDto {
        private final String id;
        private final String senderId;
        private final String recipientId;
        private final String text;
        private final Instant sentAt;

        private MessageDto(String id, String senderId, String recipientId, String text, Instant sentAt) {
            this.id = id;
            this.senderId = senderId;
            this.recipientId = recipientId;
            this.text = text;
            this.sentAt = sentAt;
        }

        public static MessageDto from(Message msg) {
            return new MessageDto(
                msg.getId(),
                msg.getSenderId(),
                msg.getRecipientId(),
                msg.getText(),
                msg.getSentAt()
            );
        }

        public String getId()          { return id; }
        public String getSenderId()    { return senderId; }
        public String getRecipientId() { return recipientId; }
        public String getText()        { return text; }
        public Instant getSentAt()     { return sentAt; }
    }

    public static class ThreadDto {
        private final String userId;
        private final String name;
        private final String lastMessage;
        private final Instant lastAt;

        private ThreadDto(String userId, String name, String lastMessage, Instant lastAt) {
            this.userId = userId;
            this.name = name;
            this.lastMessage = lastMessage;
            this.lastAt = lastAt;
        }

        public static ThreadDto from(com.vgs.backend.service.MessageService.ThreadDto svc) {
            return new ThreadDto(
                svc.userId,
                svc.name,
                svc.lastMessage,
                svc.lastAt
            );
        }

        public String getUserId()      { return userId; }
        public String getName()        { return name; }
        public String getLastMessage() { return lastMessage; }
        public Instant getLastAt()     { return lastAt; }
    }
}
