package home.secretsanta.service;

import home.secretsanta.model.PurchasedItem;
import home.secretsanta.repositories.PurchasedItemRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class PurchasedItemService {
    private final PurchasedItemRepository purchasedItemRepository;

    public PurchasedItemService(PurchasedItemRepository purchasedItemRepository) {
        this.purchasedItemRepository = purchasedItemRepository;
    }

    public Boolean createPurchasedItem(PurchasedItem purchasedItem) {
        return purchasedItemRepository.save(purchasedItem).getPurchasedItemId() != null;
    }

    public List<PurchasedItem> findAllPurchasedItemsForUser(Integer userId) {
        List<PurchasedItem> purchasedItems = purchasedItemRepository.findByUserId(userId);
        return purchasedItems;
    }
    public Boolean removePurchasedItem(Integer purchasedItemId) {
        try {
            purchasedItemRepository.deleteById(purchasedItemId);
            return true;
        } catch(Exception ex) {
            return false;
        }
    }
    @Transactional
    public Integer removeAllPurchasedItemByUserId(Integer userId) {
        return purchasedItemRepository.deleteAllByUserId(userId);
    }
}
