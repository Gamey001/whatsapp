package com.gam.whatsapp_youtube.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String content;
    private String type = "text"; // "text" or "voiceNote"
    private String voiceNoteUrl;
    private double voiceNoteDuration;
    private LocalDateTime timeStamp;
    @ManyToOne
    private User user;
    @ManyToOne
    private Chat chat;

    public Message() {
    }

    public Message(Integer id, String content, LocalDateTime timeStamp, User user, Chat chat) {
        super();
        this.id = id;
        this.content = content;
        this.timeStamp = timeStamp;
        this.user = user;
        this.chat = chat;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getVoiceNoteUrl() { return voiceNoteUrl; }
    public void setVoiceNoteUrl(String voiceNoteUrl) { this.voiceNoteUrl = voiceNoteUrl; }

    public double getVoiceNoteDuration() { return voiceNoteDuration; }
    public void setVoiceNoteDuration(double voiceNoteDuration) { this.voiceNoteDuration = voiceNoteDuration; }
}
