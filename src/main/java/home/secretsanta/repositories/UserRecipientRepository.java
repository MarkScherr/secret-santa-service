package home.secretsanta.repositories;

import home.secretsanta.model.UserRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRecipientRepository extends JpaRepository<UserRecipient, UserRecipient> {
    UserRecipient findByUserId(Integer userId);
}
