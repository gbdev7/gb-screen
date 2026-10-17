package com.gbscreen.service;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomAdmin;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LiveKitTokenService {

    @Value("${livekit.api-key:APIpHArL2DniK7Z}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    public String createToken(String roomId, String participantName, boolean isHost) {
        if (apiSecret == null || apiSecret.isBlank()) {
            throw new IllegalStateException("LIVEKIT_API_SECRET não está configurada nas variáveis do Render!");
        }

        AccessToken token = new AccessToken(apiKey, apiSecret);

        token.setName(participantName);
        token.setIdentity(participantName + "-" + System.currentTimeMillis());

        // Permissões padrão para entrar e identificar a sala
        token.addGrants(new RoomJoin(true));
        token.addGrants(new RoomName(roomId));

        // Permissão de administrador para o anfitrião gerenciar/publicar mídia
        if (isHost) {
            token.addGrants(new RoomAdmin(true));
        }

        return token.toJwt();
    }
}