package home.secretsata.controller;

import home.secretsanta.model.CredentialDto;
import home.secretsanta.service.CredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class CredentialController {
    private static final String CREDENTIAL_URI = "/credential";

    @Autowired
    private CredentialService service;

    @PostMapping(CREDENTIAL_URI)
    private Integer createCredentials(@RequestBody CredentialDto credentialDto) {
        return service.createCredentials(credentialDto);
    }

    @PostMapping(CREDENTIAL_URI)
    private Integer verifyCredentials(@RequestBody CredentialDto credentialDto) {
        return service.verifyCredentials(credentialDto);
    }



}
