package com.gam.whatsapp_youtube.service;

import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.request.UpdateUserRequest;

import java.util.List;

public interface UserService {
    public User findUserById(Integer id) throws UserException;
    public User findUserProfile(String jwt) throws UserException;
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException;
    public List<User> searchUser(String query);
}
