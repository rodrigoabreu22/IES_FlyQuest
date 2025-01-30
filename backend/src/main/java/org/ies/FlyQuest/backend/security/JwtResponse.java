package org.ies.FlyQuest.backend.security;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String roles;

    public JwtResponse(String accessToken, Long id, String email, String roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.roles = roles;
    }

    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }
}
