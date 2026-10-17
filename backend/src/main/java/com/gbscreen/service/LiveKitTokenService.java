package com.gbscreen.service;

import io.livekit.server.AccessToken;
import io.livekit.server.CanPublish;
import io.livekit.server.CanPublishData;
import io.livekit.server.CanSubscribe;
import io.livekit.server.RoomAdmin;
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

        // Adiciona permissões básicas de sala
        token.addGrants(new RoomJoin(true));
        token.addGrants(new RoomName(roomId));

        // Permissões específicas de vídeo, áudio e dados
        if (isHost) {
            token.addGrants(new RoomAdmin(true));
            token.addGrants(new CanPublish(true));
            token.addGrants(new CanSubscribe(true));
            token.addGrants(new CanPublishData(true));
        } else {
            token.addGrants(new CanPublish(false));
            token.addGrants(new CanSubscribe(true));
        }

        return token.toJwt();
    }
}