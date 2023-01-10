package home.secretsanta.model.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class MessageDto {
    @NonNull
    private String userId;
    private String phoneNumber;
    @NonNull
    private String message;

}
