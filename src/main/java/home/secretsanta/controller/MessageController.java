package home.secretsanta.controller;

import home.secretsanta.model.Message;
import home.secretsanta.model.dto.MessageDto;
import home.secretsanta.service.MessageService;
import home.secretsanta.service.SMSService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
public class MessageController {
    private static final String SEND_SMS_MESSAGE_ENDPOINT = "sms/message";
    private static final String INSERT_MESSAGE_ENDPOINT = "/message";
    private static final String GET_MESSAGE_ENDPOINT = "/message/user/{userId}/all";
    private static final String DELETE_MESSAGE_ENDPOINT = "/message/{messageIds}";
    private final SMSService smsService;
    private final MessageService messageService;

    public MessageController(MessageService messageService,
                             SMSService smsService) {
        this.messageService = messageService;
        this.smsService = smsService;
    }

    @PostMapping(SEND_SMS_MESSAGE_ENDPOINT)
    public boolean sendSmsMessage(@RequestBody MessageDto messageDto) throws Exception {
        smsService.sendSMS(messageDto.getMessage(), messageDto.getPhoneNumber());
        return true;
    }

    @PostMapping(INSERT_MESSAGE_ENDPOINT)
    public boolean insertMessage(@RequestBody MessageDto messageDto) throws Exception {
        messageService.addMessage(messageDto);
        return true;
    }

    @GetMapping(GET_MESSAGE_ENDPOINT)
    public List<Message> getMessages(@PathVariable Integer userId) throws Exception {
        return messageService.getMessagesForUser(userId);
    }

    @DeleteMapping(DELETE_MESSAGE_ENDPOINT)
    public Boolean deleteMessages(@PathVariable Integer[] messageIds) throws Exception {
        messageService.deleteMessages(Arrays.asList(messageIds));
        return true;
    }
}
