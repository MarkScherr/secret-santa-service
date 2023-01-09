package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "credentialId")
    private Integer credentialId;
    @Column(name = "userName")
    private String userName;
    @Column(name = "password")
    private String password;
}
