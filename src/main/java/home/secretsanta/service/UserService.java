package home.secretsanta.service;

import home.secretsanta.model.User;
import home.secretsanta.model.UserRecipient;
import home.secretsanta.model.UserReject;
import home.secretsanta.repositories.UserRecipientRepository;
import home.secretsanta.repositories.UserRejectRepository;
import home.secretsanta.repositories.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class UserService {

    private final UserRecipientRepository userRecipientRepository;
    private final UserRejectRepository userRejectRepository;
    private final UserRepository userRepository;

    public UserService(UserRejectRepository userRejectRepository,
                       UserRecipientRepository userRecipientRepository,
                       UserRepository userRepository) {
        this.userRecipientRepository = userRecipientRepository;
        this.userRejectRepository = userRejectRepository;
        this.userRepository = userRepository;
    }


    public User getUser(Integer userId) {
        return userRepository.findById(userId).orElse(new User());
    }

    public List<User> getAllActiveUsers() {
        return userRepository.findAllByIsActiveTrue();
    }

    public User linkUserToRecipient(UserRecipient userRecipient) {
        userRecipientRepository.save(userRecipient);
        return userRepository.findById(userRecipient.getRecipientUserId()).orElse(new User());
    }

    public User linkUserToReject(UserReject userReject) {
        userRejectRepository.save(userReject);
        return userRepository.findById(userReject.getRejectUserId()).orElse(new User());
    }

    public List<UserReject> getRejectForUser(Integer userId) {
        List<UserReject> result = new ArrayList<>();
        List<UserReject> userRejects = userRejectRepository.findByUserId(userId);
        if (userRejects != null) {
            for (UserReject userReject: userRejects) {
                User user = userRepository.getOne(userReject.getRejectUserId());
                if (user.getIsActive()) {
                    result.add(userReject);
                }
            }
        }
        return result;
    }

    public Boolean removeUserReject(Integer userId, Integer rejectUserId) {
        UserReject userReject = new UserReject();
        userReject.setUserId(userId);
        userReject.setRejectUserId(rejectUserId);
        userRejectRepository.delete(userReject);
        return true;
    }

    public List<UserRecipient> generateUserRecipientPairs() {
        List<UserRecipient> userRecipients = new ArrayList<>();
        List<User> activePresenters = getAllActiveUsers();
        List<User> availableRecipients = getAllActiveUsers();
        Map<Integer, List<Integer>> rejectMap = generateMapOfRejects();
        for (User user : activePresenters) {
            int recipientUserIndex = getRecipientIdFromRemainingRecipientsAvailable(user, availableRecipients, rejectMap);
            int recipientUserId = availableRecipients.get(recipientUserIndex).getUserId();
            UserRecipient userRecipient = new UserRecipient();
            userRecipient.setUserId(user.getUserId());
            userRecipient.setRecipientUserId(recipientUserId);
            userRecipients.add(userRecipient);
            availableRecipients.remove(recipientUserIndex);
        }
        deleteUserRecipientPairs();

        for (UserRecipient userRecipient : userRecipients) {
            userRecipientRepository.save(userRecipient);
        }
        return userRecipients;
    }

    private int getRecipientIdFromRemainingRecipientsAvailable(User user,
                                                                List<User> availableRecipients,
                                                                Map<Integer, List<Integer>> rejectMap) {
        int userId = user.getUserId();
        int availableRecipientsSize = availableRecipients.size();
        int availableRecipientIndex = -1;
        int recipientUserId = -1;

        while(availableRecipientIndex == -1 || recipientUserId == userId) {
            availableRecipientIndex = getRandomNumber(availableRecipientsSize);
            if (availableRecipientIndex >= availableRecipientsSize) {
                availableRecipientIndex = availableRecipientIndex - 1;
            }
            recipientUserId = availableRecipients.get(availableRecipientIndex).getUserId();
        }

        List<Integer> rejectIds = rejectMap.get(userId);
        if (rejectIds != null) {
            for (Integer rejectId : rejectIds) {
                if (rejectId.equals(recipientUserId)){
                    if (availableRecipients.size() <= rejectIds.size()) {
                        generateUserRecipientPairs();
                    }
                    getRecipientIdFromRemainingRecipientsAvailable(user, availableRecipients, rejectMap);
                }
            }
        }
        return availableRecipientIndex;
    }

    private Map<Integer, List<Integer>> generateMapOfRejects() {
        Map<Integer, List<Integer>> userRejectMap = new HashMap<>();
        List<UserReject> userRejects = userRejectRepository.findAll();
        for (UserReject userReject : userRejects) {
            Integer userId = userReject.getUserId();
            Integer rejectUserId = userReject.getRejectUserId();
            List<Integer> currentUserIdRejectList = userRejectMap.get(userId);
            if (currentUserIdRejectList == null) {
                currentUserIdRejectList = new ArrayList<>();
            }
            currentUserIdRejectList.add(rejectUserId);
            userRejectMap.put(userId, currentUserIdRejectList);
        }
        return userRejectMap;
    }

    private int getRandomNumber(int numberOfChoices) {
        if (numberOfChoices < 1)
            numberOfChoices = 1;
        return new Random().nextInt(numberOfChoices);
    }

    @Transactional
    private void deleteUserRecipientPairs() {
        userRecipientRepository.deleteAll();
    }

    public void setActiveField(User user) {
        Boolean isActive = user.getIsActive();
        User responseUser = userRepository.findById(user.getUserId()).orElse(new User());
        if (responseUser.getUserId() != null) {
            responseUser.setIsActive(isActive);
            userRepository.save(responseUser);
        }
    }

    public User getRecipientForUser(Integer userId) {
        UserRecipient userRecipient = userRecipientRepository.findByUserId(userId);
        return userRepository.findById(userRecipient.getRecipientUserId()).orElse(new User());
    }
}
