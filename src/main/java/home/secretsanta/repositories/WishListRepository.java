package home.secretsanta.repositories;

import home.secretsanta.model.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.Column;

public interface WishListRepository extends JpaRepository<WishList, Integer> {
    Long deleteByWishListIdAndUserId(Integer wishListId, Integer userId);
}
