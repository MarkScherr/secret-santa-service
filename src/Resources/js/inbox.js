var MESSAGE_ID_LIST = [];
var MESSAGE_LIST = [];
var MESSAGE_SENDER_LIST = [];
var MESSAGE_IDS_TO_DELETE = [];
var REPLY_MESSAGE_ID = -1;
var REPLY_MESSAGE_SENDER_ID = -1;

function loadInbox() {
    collapseNavbar();
    setNavigationActive("inbox", "home", "otherGifters", "admin");
    clearAllDivs();
    clearAllVariables();
    addHomeButton("inboxDiv");
    getMessagesFromServer();
}

function clearAllVariables() {
    SELECTED_LIST_ITEM = [];
    MESSAGE_ID_LIST = [];
    MESSAGE_LIST = [];
    MESSAGE_SENDER_LIST = [];
    MESSAGE_IDS_TO_DELETE = [];
    REPLY_MESSAGE_ID = -1;
    REPLY_MESSAGE_SENDER_ID = -1;
}

function getMessagesFromServer() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/message/user/' + CURRENT_USER_ID + '/all',
        success: function(resultList){
            $.each(resultList, function(index, type) {
                MESSAGE_ID_LIST.push(type.messageId);
                MESSAGE_LIST.push(type.message);
                MESSAGE_SENDER_LIST.push(type.senderUserId);
            });
            displayMessages();
        },
        error: function() {
        }
    });
}

function displayMessages() {
    var input = $("#inboxDiv");
    var inputTextHtml = `
        <div class="list-group">
    `;
    for ( var i = 0 ; i < MESSAGE_LIST.length ; i++) {
        inputTextHtml = inputTextHtml + '<a href="#" id="' + MESSAGE_ID_LIST[i] + '-' + MESSAGE_SENDER_LIST[i] +
            '" class="list-group-item list-group-item-action">' + MESSAGE_LIST[i] + '</a>';
    }
    inputTextHtml = inputTextHtml + `
        </div>
        <div class="col-md-12">
            <button id="replyToMessageButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>REPLY</button>
            <button id="deleteMessagesButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>DELETE</button>
        </div>
    `;
    input.append(inputTextHtml);
    setListFunctionality();
}

function deleteMessagesAction() {
    if (confirm("Are you sure you want to delete the selected messages")) {
        var messageListSize = SELECTED_LIST_ITEM.length;
        for ( var i = 0 ; i < messageListSize ; i++) {
            var divId = SELECTED_LIST_ITEM.pop()
            var divIdSplit =divId.split("-");
            var senderId = divIdSplit.pop();
            var messageId = divIdSplit.pop();
            $('#' + divId).removeClass('active');
            MESSAGE_IDS_TO_DELETE.push(messageId);
        }
        removeMessageFromServer();
    }
}

function removeMessageFromServer() {
    $.ajax({
        type: 'DELETE',
        url: BASE_URL + '/message/' + MESSAGE_IDS_TO_DELETE,
        success: function(resultList){
            alert("Messages Successfully Deleted! if you have made a terrible mistake and wish to read them again, call Mark");
            loadInbox();
        },
        error: function() {
        }
    });

}

function replyToMessageAction() {
    var isAbleToBeSent = true;
    if(SELECTED_LIST_ITEM.length === 0) {
        alert("Unable to send a message to nobody, please select a message to reply to by clicking the message first");
        isAbleToBeSent = false;
    }
    if(SELECTED_LIST_ITEM.length > 1) {
        alert("Unable to send a messages to multiple people at the same time, please select just 1 message");
        isAbleToBeSent = false;
    }
    if (isAbleToBeSent) {
        var divIdSplit = SELECTED_LIST_ITEM.pop().split("-");
        REPLY_MESSAGE_SENDER_ID = divIdSplit.pop();
        REPLY_MESSAGE_ID = divIdSplit.pop();
        addTextArea();
    }
}

function addTextArea() {
    $("#replyToMessageButton").hide();
    $("#deleteMessagesButton").hide();

    $("#inboxDiv").append(`
    <div id="replyBox" class="form-group">
        <div id="replyBoxTextArea" class="col-md-12">
            <textarea class="form-control" id="replyTextArea" rows="6"></textarea>
        </div>
        <div class="col-md-12">
            <button id="replyButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>REPLY</button>
            <button id="cancelReplyButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>CANCEL</button>
        </div>
    </div>
    `);
}

function replyAction() {
    getUserPhoneNumber();
    sendReplyMessage();
}

function getUserPhoneNumber() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/' + REPLY_MESSAGE_SENDER_ID,
        success: function(result){
            var phoneNumber = result.phoneNumber;
            console.log(phoneNumber);
//            sendReplySMSMessage(phoneNumber, 0);
        },
        error: function() {
        }
    });
}

function sendReplyMessage() {
    var stringData = JSON.stringify({
                                   userId: CURRENT_USER_ID,
                                   recipientUserId:  REPLY_MESSAGE_SENDER_ID,
                                   message: $("#replyTextArea").val(),
                                   originalMessageId: REPLY_MESSAGE_ID
                               });
    console.log("sending reply message: " + stringData);
    $.ajax({
        url: BASE_URL + '/message',
        type: 'POST',
        data: stringData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data) {},
        error: function() {}
    });
    loadInbox();
}

//function sendReplySMSMessage(phoneNumberFromMessage, currentAttempt) {
//    var outgoingMessage = $("#replyTextArea").val();
//    var stringData = JSON.stringify({
//                                   userId: CURRENT_USER_ID,
//                                   phoneNumber:  phoneNumberFromMessage,
//                                   message: outgoingMessage
//                               });
//    console.log("sending sms message: " + stringData);
//    $.ajax({
//        url: BASE_URL + '/sms/message',
//        type: 'POST',
//        data: stringData,
//        headers: {
//            'Accept': 'application/json',
//            'Content-Type': 'application/json'
//        },
//        success: function(data) {
//            alert("Message Sent Anonymously");
//            loadInbox();
//        },
//        error: function() {
//            if(currentAttempt < 5) {
//                sendReplySMSMessage(phoneNumberFromMessage, currentAttempt++);
//            }
//            loadInbox();
//        }
//    });
//}

function cancelReplyAction() {
    loadInbox();
}