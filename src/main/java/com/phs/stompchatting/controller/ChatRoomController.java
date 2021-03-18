package com.phs.stompchatting.controller;

import com.phs.stompchatting.domain.ChatMessageDTO;
import com.phs.stompchatting.domain.ChatRoomDTO;
import com.phs.stompchatting.redis.RedisPublisher;
import com.phs.stompchatting.service.ChatRoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chat")
@CrossOrigin
public class ChatRoomController {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private RedisPublisher redisPublisher;

    @Autowired
    private ChatRoomService chatRoomService;

    // 모든 채팅방 목록 반환
    @GetMapping("/rooms")
    public List<ChatRoomDTO> room() {
        return chatRoomService.findAllRoom();
    }

    // 채팅방 생성
    @PostMapping("/room")
    public ChatRoomDTO createRoom(@RequestBody ChatRoomDTO chatRoom) {
        log.info(chatRoom.getName());
        return chatRoomService.createChatRoom(chatRoom.getName());
    }

    // 특정 채팅방 조회
    @GetMapping("/room/{roomId}")
    @ResponseBody
    public ChatRoomDTO roomInfo(@PathVariable String roomId) {
        return chatRoomService.findRoomById(roomId);
    }

    @MessageMapping("/chat/message")
    public void message(ChatMessageDTO message) {

        if (ChatMessageDTO.MessageType.ENTER.equals(message.getType())) {
            log.info(message.getRoomId());
            chatRoomService.enterChatRoom(message.getRoomId());
            message.setMessage(message.getSender() + "님이 입장하셨습니다.");
        }

        redisPublisher.publish(chatRoomService.getTopic(message.getRoomId()), message);
    }
}
