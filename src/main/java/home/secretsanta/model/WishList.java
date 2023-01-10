package home.secretsanta.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="wishlist")
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Integer wishListId;
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "wishlist_item")
    private String wishListItem;
}
