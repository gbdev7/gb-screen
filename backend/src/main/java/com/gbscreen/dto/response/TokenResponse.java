package com.gbscreen.dto.response;

public record TokenResponse(
        String roomId,
        String token,
        String hostSecret
) {}