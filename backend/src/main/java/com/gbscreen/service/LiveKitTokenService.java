package com.gbscreen.service;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomGrant;
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

        // Configura a concessão completa da sala
        RoomGrant grant = new RoomGrant();
        grant.setRoomJoin(true);
        grant.setRoom(roomId);

        if (isHost) {
            grant.setCanPublish(true);
            grant.setCanSubscribe(true);
            grant.setCanPublishData(true);
            grant.setRoomAdmin(true);
        } else {
            grant.setCanPublish(false);
            grant.setCanSubscribe(true);
        }

        token.addGrant(grant);

        return token.toJwt();
    }
}