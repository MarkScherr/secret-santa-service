package home.secretsanta.controller;

import home.secretsanta.model.dto.MessageDto;
import home.secretsanta.service.SMSService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {
    private static final String SEND_SMS_MESSAGE_ENDPOINT = "/message";
    private final SMSService smsService;

    public MessageController(SMSService smsService) {
        this.smsService = smsService;
    }

    @PostMapping(SEND_SMS_MESSAGE_ENDPOINT)
    public boolean sendSmsMessage(@RequestBody MessageDto messageDto) throws Exception {
        smsService.sendSMS(messageDto.getMessage(), messageDto.getPhoneNumber());
        return true;
    }
}
