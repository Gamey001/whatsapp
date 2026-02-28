package com.gam.whatsapp_youtube.request;

public class SingleChatRequest {
    private Integer userId;

    public SingleChatRequest() {
    }

    public SingleChatRequest(Integer userId){
        super();
        this.userId = userId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
