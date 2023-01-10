package home.secretsanta.model.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class CredentialDto {
    @NonNull
    private String userName;
    @NonNull
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;

}
