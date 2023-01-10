package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="purchased_item")
public class PurchasedItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchased_item_id")
    private Integer purchasedItemId;
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "purchaser_user_id")
    private Integer purchaserUserId;
    @Column(name = "purchased_item")
    private String purchasedItem;
}
