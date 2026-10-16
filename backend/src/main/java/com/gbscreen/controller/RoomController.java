package com.gbscreen.controller;

import com.gbscreen.dto.request.RoomCreateRequest;
import com.gbscreen.dto.response.TokenResponse;
import com.gbscreen.service.LiveKitTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(
        origins = "*",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS, RequestMethod.PUT, RequestMethod.DELETE}
)
public class RoomController {

    private final LiveKitTokenService tokenService;
    private final ConcurrentHashMap<String, String> activeRooms = new ConcurrentHashMap<>();

    public RoomController(LiveKitTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<TokenResponse> createRoom(@RequestBody RoomCreateRequest request) {
        String roomId = UUID.randomUUID().toString().substring(0, 8);
        String hostSecret = UUID.randomUUID().toString();

        activeRooms.put(roomId, hostSecret);

        String token = tokenService.createToken(roomId, request.hostName(), true);
        return ResponseEntity.ok(new TokenResponse(roomId, token, hostSecret));
    }

    @GetMapping("/{id}/join")
    public ResponseEntity<TokenResponse> joinRoom(@PathVariable String id, @RequestParam String guestName) {
        if (!activeRooms.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }

        String token = tokenService.createToken(id, guestName, false);
        return ResponseEntity.ok(new TokenResponse(id, token, null));
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<Void> endRoom(@PathVariable String id, @RequestHeader("X-Host-Secret") String secret) {
        if (!activeRooms.containsKey(id) || !activeRooms.get(id).equals(secret)) {
            return ResponseEntity.status(403).build();
        }
        activeRooms.remove(id);
        return ResponseEntity.noContent().build();
    }
}