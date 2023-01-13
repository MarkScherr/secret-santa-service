package home.secretsanta.controller;

import home.secretsanta.model.dto.CredentialDto;
import home.secretsanta.service.CredentialService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
public class CredentialController {
    private static final String CREATE_CREDENTIAL_ENDPOINT = "/credential/create";
    private static final String VERIFY_CREDENTIAL_ENDPOINT = "/credential/verify";

    private final CredentialService service;

    public CredentialController(CredentialService service) {
        this.service = service;
    }

    @PostMapping(CREATE_CREDENTIAL_ENDPOINT)
//    @CrossOrigin(origins = "http://localhost:63342/*")
    public Integer createCredentials(@RequestBody CredentialDto credentialDto) {
        return service.createCredentials(credentialDto);
    }

    @PostMapping(VERIFY_CREDENTIAL_ENDPOINT)
    public Integer verifyCredentials(@Valid @RequestBody CredentialDto credentialDto) {
        return service.verifyCredentials(credentialDto);
    }
}
