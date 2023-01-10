package home.secretsanta.controller;

import home.secretsanta.model.WishList;
import home.secretsanta.model.dto.WishListDto;
import home.secretsanta.service.WishListService;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@RestController
public class WishListController {
    private static final String CREATE_WISHLIST_ITEM = "/user/{userId}/wishlist/create";
    private static final String DELETE_WISHLIST_ITEM = "/user/{userId}/wishlist/delete/{wishListItemId}";

    private final WishListService service;

    public WishListController(WishListService service) {
        this.service = service;
    }

    @PostMapping(CREATE_WISHLIST_ITEM)
    public WishList createWishlistItem(@RequestBody WishListDto wishListDto, @PathVariable Integer userId) {
        return service.createWishListItem(wishListDto.getWishListItem(), userId);
    }

    @Transactional
    @DeleteMapping(DELETE_WISHLIST_ITEM)
    public Long deleteWishListItem(@PathVariable Integer userId, @PathVariable Integer wishListItemId) {
        return service.deleteWishListItem(userId, wishListItemId);
    }
}
