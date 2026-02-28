package com.gam.whatsapp_youtube.service;

import com.gam.whatsapp_youtube.Model.Message;
import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.ChatException;
import com.gam.whatsapp_youtube.exception.MessageException;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.request.SendMessageRequest;

import java.util.List;

public interface MessageService {
    public Message sendMessage(SendMessageRequest req) throws UserException, ChatException;
    public List<Message> getChatsMessages(Integer chatId, User reqUser) throws ChatException, UserException;
    public Message findMessageById(Integer messageId) throws MessageException;
    public  void deleteMessage(Integer messageId,User reqUser) throws MessageException,UserException;
    }
