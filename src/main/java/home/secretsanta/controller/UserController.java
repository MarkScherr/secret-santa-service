package home.secretsanta.controller;

import home.secretsanta.model.User;
import home.secretsanta.model.UserRecipient;
import home.secretsanta.model.UserReject;
import home.secretsanta.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private static final String GET_USER_ENDPOINT = "/users/{userId}";
    private static final String GET_ACTIVE_USERS_ENDPOINT = "/users/findAllActive";
    private static final String SET_ACTIVE_FIELD_ENDPOINT = "/users/active";
    private static final String CREATE_USER_RECIPIENT_ENDPOINT = "/users/recipient";
    private static final String CALCULATE_USER_RECIPIENT_ENDPOINT = "/users/recipient/calculate";
    private static final String CREATE_USER_REJECT_ENDPOINT = "/users/reject";
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(GET_USER_ENDPOINT)
    public User getUser(@PathVariable Integer userId) {
        return userService.getUser(userId);
    }
    @GetMapping(GET_ACTIVE_USERS_ENDPOINT)
    public List<User> getAllActiveUsers() {
        return userService.getAllActiveUsers();
    }

    @PutMapping(SET_ACTIVE_FIELD_ENDPOINT)
    public Boolean setActiveField(@RequestBody User user) {
        userService.setActiveField(user);
        return true;
    }

    @PostMapping(CREATE_USER_RECIPIENT_ENDPOINT)
    public User linkUserToRecipient(@RequestBody UserRecipient userRecipient) {
        return userService.linkUserToRecipient(userRecipient);
    }

    @PostMapping(CREATE_USER_REJECT_ENDPOINT)
    public User linkUserToRecipient(@RequestBody UserReject userReject) {
        return userService.linkUserToReject(userReject);
    }

    @GetMapping(CALCULATE_USER_RECIPIENT_ENDPOINT)
    public List<UserRecipient> generateUserRecipientPairs() {
        return userService.generateUserRecipientPairs();
    }
}
