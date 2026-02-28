package com.gam.whatsapp_youtube.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequestMapping("/api")
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<String> homeConroller(){
        return new ResponseEntity<String>("Welcome to our whatsapp api using spring boot", HttpStatus.OK);
    }
}
