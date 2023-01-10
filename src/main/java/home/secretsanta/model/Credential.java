package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="credential")
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credential_id")
    private Integer credentialId;
    @Column(name = "user_name")
    private String userName;
    @Column(name = "p_word")
    private String password;
    @Column(name = "phone_number")
    private String phoneNumber;
}
