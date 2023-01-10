package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@IdClass(UserRecipient.class)
@Table(name="user_recipient")
public class UserRecipient implements Serializable {
    @Id
    @Column(name = "user_id")
    private Integer userId;
    @Id
    @Column(name = "recipient_user_id")
    private Integer recipientUserId;
}
