package com.gbscreen.service;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomAdmin;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LiveKitTokenService {

    @Value("${livekit.api-key:APIHb8fo3vvBTpb}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    public String createToken(String roomId, String participantName, boolean isHost) {
        if (apiSecret == null || apiSecret.isBlank()) {
            throw new IllegalStateException("LIVEKIT_API_SECRET não foi configurado no Render.");
        }

        // Remove eventuais espaços acidentais nas chaves
        String cleanKey = apiKey.trim();
        String cleanSecret = apiSecret.trim();

        AccessToken token = new AccessToken(cleanKey, cleanSecret);

        token.setName(participantName);
        token.setIdentity(participantName + "-" + System.currentTimeMillis());

        // Define tempo de vida do token para 24 horas (em segundos)
        token.setTtl(86400L);

        token.addGrants(new RoomJoin(true));
        token.addGrants(new RoomName(roomId));

        if (isHost) {
            token.addGrants(new RoomAdmin(true));
        }

        return token.toJwt();
    }
}