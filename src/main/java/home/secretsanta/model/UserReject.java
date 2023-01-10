package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@IdClass(UserReject.class)
@Table(name="user_reject")
public class UserReject implements Serializable {
    @Id
    @Column(name = "user_id")
    private Integer userId;
    @Id
    @Column(name = "reject_user_id")
    private Integer rejectUserId;
}
