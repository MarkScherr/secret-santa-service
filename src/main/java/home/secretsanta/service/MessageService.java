package home.secretsanta.service;

import home.secretsanta.model.Message;
import home.secretsanta.model.User;
import home.secretsanta.model.dto.MessageDto;
import home.secretsanta.repositories.MessageRepository;
import home.secretsanta.repositories.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public void addMessage(MessageDto messageDto) {
        if (messageDto.getOriginalMessageId() != null) {
            messageDto.setMessage("RE: " + messageDto.getMessage());
        }
        messageRepository.save(getMessageFromMessageDto(messageDto));
    }

    private Message getMessageFromMessageDto(MessageDto messageDto) {
        Message message = new Message();
        message.setSenderUserId(messageDto.getUserId());
        message.setRecipientUserId(messageDto.getRecipientUserId());
        message.setMessage(messageDto.getMessage());
        return message;
    }

    public List<Message> getMessagesForUser(Integer userId) {
        return messageRepository.findByRecipientUserId(userId);
    }
    @Transactional
    public void deleteMessages(List<Integer> messageIds) {
        for(Integer messageId : messageIds) {
            messageRepository.deleteById(messageId);
        }
    }
}
