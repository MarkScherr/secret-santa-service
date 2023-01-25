package home.secretsanta.service;

import home.secretsanta.model.Credential;
import home.secretsanta.model.dto.CredentialDto;
import home.secretsanta.model.User;
import home.secretsanta.repositories.CredentialRepository;
import home.secretsanta.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    public CredentialService(CredentialRepository credentialRepository,
                             UserRepository userRepository) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
    }

    public Integer createCredentials(CredentialDto credentialDto) {
        if (verifyCredentials(credentialDto) != -1) {
            return -1;
        }
        Credential credential = createCredentialFromDto(credentialDto);
        credential = credentialRepository.save(credential);
        User user = createUserFromDto(credentialDto, credential.getCredentialId());
        user = userRepository.save(user);
        return user.getUserId();
    }

    private Credential createCredentialFromDto(CredentialDto credentialDto) {
        Credential credential = new Credential();
        credential.setUserName(credentialDto.getUserName());
        credential.setPassword(credentialDto.getPassword());
        credential.setPhoneNumber(credentialDto.getPhoneNumber());
        return credential;
    }

    private User createUserFromDto(CredentialDto credentialDto, Integer credentialId) {
        User user = new User();
        user.setFirstName(credentialDto.getFirstName());
        user.setLastName(credentialDto.getLastName());
        user.setPhoneNumber(credentialDto.getPhoneNumber());
        user.setCredentialId(credentialId);
        return user;
    }

    public Integer verifyCredentials(CredentialDto credentialDto) {
        Credential credential = credentialRepository
                .findByUserNameAndPassword(credentialDto.getUserName(), credentialDto.getPassword());
        if (credential == null || credential.getCredentialId() == null) {
            return -1;
        }
        User user = userRepository.findByCredentialId(credential.getCredentialId());
        return user != null && user.getUserId() != null ?
                user.getUserId() :
                -1;
    }
}
