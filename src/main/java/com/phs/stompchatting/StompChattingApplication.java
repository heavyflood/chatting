package com.phs.stompchatting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@SpringBootApplication
public class StompChattingApplication {

    public static void main(String[] args) {
        SpringApplication.run(StompChattingApplication.class, args);
    }

    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

}
