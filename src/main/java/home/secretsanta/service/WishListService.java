package home.secretsanta.service;

import home.secretsanta.model.WishList;
import home.secretsanta.repositories.WishListRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishListService {
    private final WishListRepository wishListRepository;

    public WishListService(WishListRepository wishListRepository) {
        this.wishListRepository = wishListRepository;
    }

    public WishList createWishListItem(String wishListItem, Integer userId) {
        WishList wishList = createWishList(wishListItem, userId);
        return wishListRepository.save(wishList);
    }

    private WishList createWishList(String wishListItem, Integer userId) {
        WishList wishList = new WishList();
        wishList.setWishListItem(wishListItem);
        wishList.setUserId(userId);
        return wishList;
    }

    public Long deleteWishListItem(Integer userId, Integer wishListItemId) {
        return wishListRepository.deleteByWishListIdAndUserId(wishListItemId, userId);
    }

    public List<WishList> getWishListItems(Integer userId) {
        return wishListRepository.findByUserId(userId);
    }

    public boolean updateWishListItem(WishList wishList) {
        Optional<WishList> result = wishListRepository.findById(wishList.getWishListId());
        result.orElse(wishList).setWishListItem(wishList.getWishListItem());
        WishList saveResult = wishListRepository.save(result.orElse(wishList));
        return saveResult.getWishListId().equals(wishList.getWishListId());
    }
}
