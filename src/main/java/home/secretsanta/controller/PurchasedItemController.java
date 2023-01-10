package home.secretsanta.controller;

import home.secretsanta.model.PurchasedItem;
import home.secretsanta.service.PurchasedItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PurchasedItemController {
    private final PurchasedItemService service;

    private static final String FIND_ALL_PURCHASED_ITEM_FOR_USER_ID_ENDPOINT = "/purchasedItem/findAll/{userId}";
    private static final String CREATE_PURCHASED_ITEM_ENDPOINT = "/purchasedItem";
    private static final String REMOVE_PURCHASED_ITEM_ENDPOINT = "/purchasedItem/{purchasedItemId}";
    private static final String REMOVE_ALL_PURCHASED_ITEM_BY_USER_ID_ENDPOINT = "/purchasedItem/user/{userId}";

    public PurchasedItemController(PurchasedItemService service) {
        this.service = service;
    }

    @PostMapping(CREATE_PURCHASED_ITEM_ENDPOINT)
    public Boolean createPurchasedItem(@RequestBody PurchasedItem purchasedItem) {
        return service.createPurchasedItem(purchasedItem);
    }

    @GetMapping(FIND_ALL_PURCHASED_ITEM_FOR_USER_ID_ENDPOINT)
    public List<PurchasedItem> findAllPurchasedItemsForUser(@PathVariable Integer userId) {
        return service.findAllPurchasedItemsForUser(userId);
    }

    @DeleteMapping(REMOVE_PURCHASED_ITEM_ENDPOINT)
    public Boolean removePurchasedItem(@PathVariable Integer purchasedItemId) {
        return service.removePurchasedItem(purchasedItemId);
    }

    @DeleteMapping(REMOVE_ALL_PURCHASED_ITEM_BY_USER_ID_ENDPOINT)
    public Integer removeAllPurchasedItemByUserId(@PathVariable Integer userId) {

        return service.removeAllPurchasedItemByUserId(userId);
    }
}
