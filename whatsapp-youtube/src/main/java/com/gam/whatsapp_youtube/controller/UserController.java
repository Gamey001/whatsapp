package com.gam.whatsapp_youtube.controller;

import com.gam.whatsapp_youtube.Model.User;
import com.gam.whatsapp_youtube.exception.UserException;
import com.gam.whatsapp_youtube.request.UpdateUserRequest;
import com.gam.whatsapp_youtube.response.ApiResponse;
import com.gam.whatsapp_youtube.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService userService;
    public UserController(UserService userService){
        this.userService = userService;
    }
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token) throws UserException {
        User user = userService.findUserProfile(token);
        return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
    }
    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String q){
      List<User> users = userService.searchUser(q);
      return new ResponseEntity<List<User>>(users,HttpStatus.OK);
    }
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUserHandler(
            @RequestBody UpdateUserRequest req,
            @RequestHeader("Authorization") String token) throws UserException{

        // Get the currently authenticated user from token
        User user = userService.findUserProfile(token);

        // Perform update
        userService.updateUser(user.getId(), req);

        // Build response
        ApiResponse res = new ApiResponse("User updated successfully", true);

        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

}
