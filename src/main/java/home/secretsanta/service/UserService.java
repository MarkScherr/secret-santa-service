package home.secretsanta.service;

import home.secretsanta.model.User;
import home.secretsanta.model.UserRecipient;
import home.secretsanta.repositories.UserRecipientRepository;
import home.secretsanta.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserRecipientRepository userRecipientRepository;

    public UserService(UserRecipientRepository userRecipientRepository,
                       UserRepository userRepository) {
        this.userRecipientRepository = userRecipientRepository;
        this.userRepository = userRepository;
    }

    public List<User> getAllActiveUsers() {
        return userRepository.findAllByIsActiveTrue();
    }

    public User linkUserToRecipient(UserRecipient userRecipient) {
        userRecipientRepository.save(userRecipient);
        return userRepository.findById(userRecipient.getRecipientUserId()).orElse(new User());
    }
}
