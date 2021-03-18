package com.phs.stompchatting.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDTO {

    public enum MessageType { ENTER, TALK }

    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
}
