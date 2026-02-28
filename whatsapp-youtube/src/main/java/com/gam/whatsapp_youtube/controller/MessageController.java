package com.gam.whatsapp_youtube.controller;

import com.gam.whatsapp_youtube.Model.Message;
import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.ChatException;
import com.gam.whatsapp_youtube.exception.MessageException;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.request.SendMessageRequest;
import com.gam.whatsapp_youtube.response.ApiResponse;
import com.gam.whatsapp_youtube.service.MessageService;
import com.gam.whatsapp_youtube.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private MessageService messageService;
    private UserService userService;

    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }
    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMessageRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User user = userService.findUserProfile(jwt);

        req.setUserId(user.getId());
        Message message = messageService.sendMessage(req);

        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }
    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getChatsMessagesHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User user = userService.findUserProfile(jwt);

        List<Message> messages = messageService.getChatsMessages(chatId,user);

        return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
    }
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(@PathVariable Integer messageId, @RequestHeader("Authorization") String jwt) throws UserException, MessageException {
        User user = userService.findUserProfile(jwt);

        messageService.deleteMessage(messageId,user);
        ApiResponse res = new ApiResponse("Message has been deleted successful",false);
        return new ResponseEntity<ApiResponse>(res, HttpStatus.OK);
    }
}
