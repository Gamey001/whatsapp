package com.gam.whatsapp_youtube.controller;

import com.gam.whatsapp_youtube.Model.Chat;
import com.gam.whatsapp_youtube.Model.Message;
import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.ChatException;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.repository.MessageRepository;
import com.gam.whatsapp_youtube.service.ChatService;
import com.gam.whatsapp_youtube.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class VoiceNoteController {

    private static final String UPLOAD_DIR = "uploads";

    private final UserService userService;
    private final ChatService chatService;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public VoiceNoteController(
            UserService userService,
            ChatService chatService,
            MessageRepository messageRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.userService = userService;
        this.chatService = chatService;
        this.messageRepository = messageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/voice")
    public ResponseEntity<Message> uploadVoiceNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam("chatId") Integer chatId,
            @RequestParam("duration") double duration,
            @RequestHeader("Authorization") String jwt) throws UserException, ChatException {

        User sender = userService.findUserProfile(jwt);
        Chat chat = chatService.findChatById(chatId);

        if (!chat.getUsers().contains(sender)) {
            throw new UserException("You are not a member of this chat");
        }

        // Ensure upload directory exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        Files.createDirectories(uploadPath);

        // Save file with a UUID name
        String fileName = UUID.randomUUID() + ".webm";
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Create and persist the message
        Message message = new Message();
        message.setUser(sender);
        message.setChat(chat);
        message.setType("voiceNote");
        message.setVoiceNoteUrl("uploads/" + fileName);
        message.setVoiceNoteDuration(duration);
        message.setTimeStamp(LocalDateTime.now());

        Message saved = messageRepository.save(message);

        // Broadcast via WebSocket so other chat members receive it live
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, saved);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
