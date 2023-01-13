package home.secretsanta.model.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class MessageDto {
    @NonNull
    private Integer userId;
    private Integer recipientUserId;
    private String phoneNumber;
    @NonNull
    private String message;
    private Integer originalMessageId;

}
