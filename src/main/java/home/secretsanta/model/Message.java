package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @Column(name = "sender_user_id")
    private Integer senderUserId;

    @Column(name = "recipient_user_id")
    private Integer recipientUserId;

    @Column(name = "message")
    private String message;
}