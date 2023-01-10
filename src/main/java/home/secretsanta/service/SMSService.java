package home.secretsanta.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

@Service
public class SMSService {

    public void sendSMS(String message, String phoneNumber) throws Exception {
        message = "\uD83C\uDF84 FROM SECRET SANTA NOT MARK \uD83C\uDF85\n" + message;
        phoneNumber = "1" + phoneNumber;
        String username = "markthegreat";
        String password = "1234";
        String address = "http://10.0.0.101";
        String port = "8090";

        URL url = new URL(
                address + ":" + port + "/SendSMS?username=" + username + "&password=" + password +
                        "&phone=" + phoneNumber + "&message=" + URLEncoder.encode(message, "UTF-8"));

        URLConnection connection = url.openConnection();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        while ((inputLine = bufferedReader.readLine()) != null) {
            System.out.println(inputLine);
        }
        bufferedReader.close();
    }
}
