var OTHER_GIFTEES_ID_NAME_MAP = new Map();
var OTHER_GIFTEES_NAME_WISHLIST_MAP = new Map();
var OTHER_GIFTEES_ID_PURCHASED_ITEM_MAP = new Map();

function loadOtherGifters() {
    console.log("CURRENT_USER_ID: " + CURRENT_USER_ID + " jsFile: OG");
    collapseNavbar();
    $('html, body').animate({scrollTop: '0px'}, 300);
    setNavigationActive("otherGifters", "inbox", "home", "admin");
    clearAllDivs();
    addHomeButton("otherGiftersDiv");
    populateMapsOfGiftees();
}

function populateMapsOfGiftees() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/findAllActive',
        success: function(resultList){
            $.each(resultList, function(index, type) {
                var userMap = new Map();
                userMap.set('name', type.firstName.charAt(0).toUpperCase() + type.firstName.slice(1).toLowerCase() + ' ' +
                type.lastName.charAt(0).toUpperCase() + type.lastName.slice(1).toLowerCase());
                userMap.set('phoneNumber', type.phoneNumber);
                var userId = parseInt(type.userId);
                if(userId != CURRENT_USER_ID) {
                    OTHER_GIFTEES_ID_NAME_MAP.set(userId, userMap);
                }
            });
            console.log('OTHER_GIFTEES_ID_NAME_MAP: ' + OTHER_GIFTEES_ID_NAME_MAP);
            populateMapOfWishlists();
        },
        error: function() {
        }
    });
}

function populateMapOfWishlists() {
    for (let [key, value] of OTHER_GIFTEES_ID_NAME_MAP) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/user/' + key + '/wishlist',
            success: function(result){
                var listOfWishListItems = [];
                $.each(result, function(index, type) {
                    listOfWishListItems.push(type.wishListItem);
                });
                OTHER_GIFTEES_NAME_WISHLIST_MAP.set(key, listOfWishListItems);
            },
            error: function() {
            }
        });
    }
    setTimeout(function() {
        attachOtherGiftersAccordion();
    }, 1000);
    console.log('OTHER_GIFTEES_NAME_WISHLIST_MAP: ' + OTHER_GIFTEES_NAME_WISHLIST_MAP);
}

function attachOtherGiftersAccordion() {
    input = $("#otherGiftersDiv");
    var index = 0;
    var inputText = '<div class="accordion" id="accordionExample">';
    for (let [key, value] of OTHER_GIFTEES_NAME_WISHLIST_MAP) {
        console.log('key: ' + key);
        inputText += '<div class="card"><div class="card-header" id="heading-'+ key + ' "><h2 class="mb-0">' +
        '<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"' +
        'data-target="#collapse-' + key + '" aria-expanded="false" aria-controls="collapse-' + key + '">' +
        OTHER_GIFTEES_ID_NAME_MAP.get(key).get('name') + '</button></h2></div><div id="collapse-' + key + '" class="collapse"' +
        'aria-labelledby="heading-' + key + '" data-parent="#accordionExample"><div class="card-body" id="divBody-' + key +
        '">';
        inputText += '<div id="purchasedDiv-' + key + '"><button id="purchased-' + key + '"  type="button" class="btn btn-lg btn-block btn-danger" ' +
            'onClick=purchasedItemAction(this.id)>Purchased</button></div>';
        console.log("value: " + value);
        inputText += '<h2>' + OTHER_GIFTEES_ID_NAME_MAP.get(key).get('name') +'\'s Wishlist:</h2>';
        if (value == null || value.length < 1) {
            inputText += '<a href="#" class="list-group-item list-group-item-action" style="white-space: pre-line">This user does not have a wish list yet</a>';
        }
        for (var i = 0 ; i < value.length ; i++) {
            var wishListItem = value[i];
            wishListItem = linkify(wishListItem);
            if (!wishListItem.includes("<a")) {
                wishListItem = '<a href="#" class="list-group-item list-group-item-action" style="white-space: pre-line">' + wishListItem + '</a>';
            }
            inputText += wishListItem;
        }
        inputText += '';
        inputText += '<div id="messageDiv-' + key + '"><button id="messageAreaButton-' + key + '"  type="button" class="btn btn-lg btn-block btn-success" ' +
        'onClick=messageAction(this.id)>MESSAGE</button></div></div></div></div>';
    }
    inputText += '</div>';
    input.append(inputText);
}

function messageAction(divId) {
    var userId = divId.split('-')[1].replaceAll("\"", "");
    $('#messageAreaButton-' + userId).hide();
    var inputText = `
    <div id="replyBox" class="form-group">
        <div id="sendMessageTextArea" class="col-md-12">
            <textarea class="form-control" id="messageTextArea" rows="6"></textarea>
        </div>
        <div class="col-md-12">
            <button id="messageButton-
    `;
    inputText += userId + `
    " type="button" class="btn btn-lg btn-block btn-success"
                onClick=sendMessageAction(this.id)>SEND MESSAGE</button>
            <button id="cancelButton-
    `;
    inputText += userId + `
    " type="button" class="btn btn-lg btn-block btn-danger"
                onClick=cancelMessageAction(this.id)>CANCEL</button>
        </div>
    </div>
    `;
    $('#messageDiv-' + userId).append(inputText);
}

function cancelMessageAction(divId) {
    var userId = divId.split('-')[1].replaceAll("\"", "").trim();
    $('#replyBox').remove();
    console.log('userId' + userId);
    console.log('#messageAreaButton-' + userId);
    $('#messageAreaButton-' + userId).show();
}

function sendMessageAction(divId) {
    var messageRecipientUserId = Number(divId.split('-')[1]);
//    var phoneNumber = OTHER_GIFTEES_ID_NAME_MAP.get(messageRecipientUserId).get('phoneNumber');
    const outgoingMessage = $("#messageTextArea").val();
//    sendSMSMessage(outgoingMessage, phoneNumber, 0);
    sendMessage(outgoingMessage, messageRecipientUserId);
}

function sendMessage(outgoingMessage, messageRecipientUserId) {
    var stringData = JSON.stringify({
                                   userId: CURRENT_USER_ID,
                                   recipientUserId:  messageRecipientUserId,
                                   message: outgoingMessage
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
        success: function(data) {
            cancelMessageAction("cancel-" + messageRecipientUserId);
        },
        error: function() {}
    });
}

//function sendSMSMessage(outgoingMessage, phoneNumberFromMessage, currentAttempt) {
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
//        },
//        error: function() {
//            if(currentAttempt < 5) {
//                currentAttempt++;
//                sendSMSMessage(outgoingMessage, phoneNumberFromMessage, currentAttempt++);
//            }
//        }
//    });
//}

function purchasedItemAction(divId) {
    var userId = Number(divId.split('-')[1].trim());
    getPurchasedItemsFromServer(userId);
}

function getPurchasedItemsFromServer(userId) {
    if (OTHER_GIFTEES_ID_PURCHASED_ITEM_MAP.get(userId) == null) {
        $.ajax({
            type: 'GET',
            url: BASE_URL + '/purchasedItem/findAll/' + userId,
            success: function(result) {
                var listOfPurchasedItems = [];
                $.each(result, function(index, type) {
                    listOfPurchasedItems.push(type.purchasedItem);
                });
                OTHER_GIFTEES_ID_PURCHASED_ITEM_MAP.set(userId, listOfPurchasedItems);
                console.log("gathered purchased items " + OTHER_GIFTEES_ID_PURCHASED_ITEM_MAP);
                populatePurchasedItemSection(userId);
            },
            error: function() {
            }
        });
    } else {
        populatePurchasedItemSection(userId);
    }
}

function populatePurchasedItemSection(userId) {
    var inputDiv = $('#purchasedDiv-' + userId);
    inputDiv.empty();
    var inputText = '<h2>Already Purchased Items for ' + OTHER_GIFTEES_ID_NAME_MAP.get(userId).get('name') +'</h2>' ;
    var purchasedItems = OTHER_GIFTEES_ID_PURCHASED_ITEM_MAP.get(userId);
    for (var i = 0 ; i < purchasedItems.length ; i++) {
        var purchasedItem = purchasedItems[i];
        purchasedItem = linkify(purchasedItem);
        if (!purchasedItem.includes("<a")) {
            purchasedItem = '<a href="#" class="list-group-item list-group-item-action" style="white-space: pre-line">' + purchasedItem + '</a>';
        }
        inputText += purchasedItem;
    }
    inputText += `
        <div id="sendPurchasedItemTextArea" class="col-md-12">
            <textarea class="form-control" id="purchasedItemTextArea" rows="2"></textarea>
            <button id="sendPurchasedItem-
            ` + userId + `
            " type="button" class="btn btn-lg btn-block btn-success"
                    onClick=sendPurchasedItem(this.id)>ADD ITEM</button>
        <button id="closePurchased-
         `+ userId + `
         "  type="button" class="btn btn-lg btn-block btn-danger"  onClick=closePurchasedItemAction(this.id)>Close Purchased</button>
        </div>
        `
    inputDiv.append(inputText);
}

function closePurchasedItemAction(divId) {
    var userId = Number(divId.split('-')[1].trim());
    var inputDiv = $('#purchasedDiv-' + userId);
    console.log(inputDiv);
    inputDiv.empty();
    inputDiv.append('<button id="purchased-' + userId + '"  type="button" class="btn btn-lg btn-block btn-danger" ' +
            'onClick=purchasedItemAction(this.id)>Purchased</button></div>');

}
function sendPurchasedItem(divId) {
    var userId = Number(divId.split('-')[1].trim());
    var purchasedItemToSubmit = $("#purchasedItemTextArea").val();
    var stringData = JSON.stringify({
                                   userId: userId,
                                   purchaserUserId: CURRENT_USER_ID,
                                   purchasedItem: purchasedItemToSubmit
                               });
    console.log("sending purchased item: " + stringData);
    $.ajax({
        url: BASE_URL + '/purchasedItem',
        type: 'POST',
        data: stringData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data) {
            OTHER_GIFTEES_ID_PURCHASED_ITEM_MAP.get(userId).push(purchasedItemToSubmit);
            populatePurchasedItemSection(userId);
            cancelMessageAction("cancel-" + messageRecipientUserId);
        },
        error: function() {
            alert('Unable to add purchased item at this moment.  If the error persists please let Mark know.');

            populatePurchasedItemSection(userId);
        }
    });
}
