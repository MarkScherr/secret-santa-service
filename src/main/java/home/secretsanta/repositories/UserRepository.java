package home.secretsanta.repositories;

import home.secretsanta.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByCredentialId(Integer credentialId);
    List<User> findAllByIsActiveTrue();
}
