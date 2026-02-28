package com.gam.whatsapp_youtube.controller;

import com.gam.whatsapp_youtube.Model.Chat;
import com.gam.whatsapp_youtube.Model.Message;
import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.ChatException;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.request.SendMessageRequest;
import com.gam.whatsapp_youtube.service.ChatService;
import com.gam.whatsapp_youtube.service.MessageService;
import com.gam.whatsapp_youtube.service.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
public class WebSocketMessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final ChatService chatService;
    private final UserService userService;

    public WebSocketMessageController(
            SimpMessagingTemplate messagingTemplate,
            MessageService messageService,
            ChatService chatService,
            UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.chatService = chatService;
        this.userService = userService;
    }

    /**
     * Client sends to /app/chat with a SendMessageRequest payload.
     * After persisting, broadcasts the saved Message to /topic/chat/{chatId}
     * so all subscribers (chat participants) receive it in real time.
     */
    @MessageMapping("/chat")
    public void handleMessage(@Payload SendMessageRequest req) {
        try {
            // Persist the message via the existing service
            Message message = messageService.sendMessage(req);

            // Broadcast to the chat topic — all subscribers see the new message
            messagingTemplate.convertAndSend(
                    "/topic/chat/" + req.getChatId(),
                    message
            );
        } catch (UserException | ChatException e) {
            // Publish error back to the sender's personal queue
            // Client subscribes to /queue/errors to receive these
            messagingTemplate.convertAndSend("/queue/errors", e.getMessage());
        }
    }

    /**
     * Typing indicator: client sends to /app/typing
     * Broadcasts { chatId, userId, typing: true } to the chat topic.
     */
    @MessageMapping("/typing")
    public void handleTyping(@Payload TypingPayload payload) {
        messagingTemplate.convertAndSend(
                "/topic/typing/" + payload.getChatId(),
                payload
        );
    }

    /**
     * Stop-typing indicator: client sends to /app/stopTyping
     */
    @MessageMapping("/stopTyping")
    public void handleStopTyping(@Payload TypingPayload payload) {
        payload.setTyping(false);
        messagingTemplate.convertAndSend(
                "/topic/typing/" + payload.getChatId(),
                payload
        );
    }

    // --- Simple inner DTO for typing payloads (no DB backing needed) ---
    public static class TypingPayload {
        private Integer chatId;
        private Integer userId;
        private boolean typing = true;

        public TypingPayload() {}

        public Integer getChatId() { return chatId; }
        public void setChatId(Integer chatId) { this.chatId = chatId; }

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }

        public boolean isTyping() { return typing; }
        public void setTyping(boolean typing) { this.typing = typing; }
    }
}
