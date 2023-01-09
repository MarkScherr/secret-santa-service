package home.secretsanta.repositories;

import home.secretsanta.model.Credential;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CredentialRepository extends JpaRepository<Credential, Integer> {
    Credential findByUserNameAndPassword(String userName, String password);
}
