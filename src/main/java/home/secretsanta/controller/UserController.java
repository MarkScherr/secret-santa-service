package home.secretsanta.controller;

import home.secretsanta.model.User;
import home.secretsanta.model.UserRecipient;
import home.secretsanta.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private static final String GET_ACTIVE_USERS_ENDPOINT = "/users/findAllActive";
    private static final String CREATE_USER_RECIPIENT_ENDPOINT = "/users/recipient";
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(GET_ACTIVE_USERS_ENDPOINT)
    public List<User> getAllActiveUsers() {
        return userService.getAllActiveUsers();
    }
    @PostMapping(CREATE_USER_RECIPIENT_ENDPOINT)
    public User linkUserToRecipient(@RequestBody UserRecipient userRecipient) {
        return userService.linkUserToRecipient(userRecipient);
    }
}
