package home.secretsanta.repositories;

import home.secretsanta.model.UserReject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRejectRepository extends JpaRepository<UserReject, UserReject> {
    List<UserReject> findByUserId(Integer userId);
}
