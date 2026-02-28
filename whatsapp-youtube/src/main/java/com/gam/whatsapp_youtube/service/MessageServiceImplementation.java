package com.gam.whatsapp_youtube.service;

import com.gam.whatsapp_youtube.Model.Chat;
import com.gam.whatsapp_youtube.Model.Message;
import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.ChatException;
import com.gam.whatsapp_youtube.exception.MessageException;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.repository.MessageRepository;
import com.gam.whatsapp_youtube.request.SendMessageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
public class MessageServiceImplementation implements  MessageService {
    private MessageRepository messageRepository;
    private UserService userService;
    private ChatService chatService;

    public MessageServiceImplementation(MessageRepository messageRepository, UserService userService, ChatService chatService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
        this.chatService = chatService;
    }

    @Override
    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException {
        User user = userService.findUserById(req.getUserId());
        Chat chat = chatService.findChatById(req.getChatId());

        Message message = new Message();

        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimeStamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException {
        Chat chat = chatService.findChatById(chatId);

        if(!chat.getUsers().contains(reqUser)){
           throw new UserException("You are not related to this chat: "+chat.getId());
        }
        List<Message> messages = messageRepository.findChatById(chat.getId());
        return messages;
    }

    @Override
    public Message findMessageById(Integer messageId) throws MessageException {
        Optional<Message> opt = messageRepository.findById(messageId);

        if(opt.isPresent()){
            return opt.get();
        }
        throw new MessageException("Message not found with id: "+messageId);
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException {
    Message message = findMessageById(messageId);

    if(message.getUser().getId().equals(reqUser.getId())){
        messageRepository.deleteById(messageId);
        return;
    }
    throw new UserException("You can not delete another user's message: "+reqUser.getFull_name());
    }
}
