package com.gam.whatsapp_youtube.response;


public class AuthResponse {
    private String jwt;
    private boolean isAuth;
    public AuthResponse(String jwt, boolean isAuth) {
        super();
        this.jwt =  jwt;
        this.isAuth = isAuth;
    }

    public String getJwt() { return jwt; }
    public void setJwt(String jwt) { this.jwt = jwt; }

    public boolean isAuth() { return isAuth; }
    public void setAuth(boolean auth) { isAuth = auth; }
}
