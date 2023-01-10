package home.secretsanta.repositories;

import home.secretsanta.model.PurchasedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchasedItemRepository extends JpaRepository<PurchasedItem, Integer> {
    Integer deleteAllByUserId(Integer userId);
    List<PurchasedItem> findByUserId(@Param("userId")   Integer userId);
}
