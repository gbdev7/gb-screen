package com.gbscreen.service;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LiveKitTokenService {

    @Value("${livekit.api-key}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    public String createToken(String roomId, String participantName, boolean isHost) {
        AccessToken token = new AccessToken(apiKey, apiSecret);

        token.setName(participantName);
        token.setIdentity(participantName + "-" + System.currentTimeMillis());

        // Adiciona permissões de entrada e identificação de sala
        token.addGrants(new RoomJoin(true));
        token.addGrants(new RoomName(roomId));

        // Define as permissões de publicação e inscrição do participante
        if (isHost) {
            token.addGrants(new io.livekit.server.RoomAdmin(true));
        }

        return token.toJwt();
    }
}