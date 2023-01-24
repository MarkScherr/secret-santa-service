var IS_ACTIVE = false;
var WISH_LIST_MAP = new Map();
var RECIPIENT_WISH_LIST_DISPLAY = "";
var CURRENT_RECIPIENT_USER_ID = -1;
var CURRENT_REJECT_LIST = [];
var CURRENT_OTHER_USER_ID_TO_NAME_MAP = new Map();

function loadHome() {
    console.log("CURRENT_USER_ID: " + CURRENT_USER_ID + " jsFile: home");
    collapseNavbar();
    $('html, body').animate({scrollTop: '0px'}, 300);
    clearLocalGlobalVariables();
    setNavigationActive("home", "inbox", "otherGifters", "admin");
    $("#navigation").show();
    clearAllDivs();
    addOptInToggle();
}

function clearLocalGlobalVariables() {
    WISH_LIST_MAP = new Map();
    SELECTED_LIST_ITEM = [];
    CURRENT_REJECT_LIST = [];
    CURRENT_OTHER_USER_ID_TO_NAME_MAP = new Map();
}
function addOptInToggle() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/' + CURRENT_USER_ID,
        success: function(result){
            var isActive = result.isActive;
            if (isActive == null) {
               isActive = false
            }
            IS_ACTIVE = isActive
            addOptInToggleToDiv();
            addRejectGifteeButton();
            addGiftee();
            myWishListItemButton();
        },
        error: function() {
        }
    });
}

function addOptInToggleToDiv() {
    $("#homeDiv").append(`
    <div class="col-md-12">
        <div id="snowButton" class="bg" onClick=linkClick(this.id)>
            <div class="centerer">
                <a href="#" id="participationButton" class="button">PARTICIPATING</a>
            </div>
        </div>
	</div>
    `);
    if (IS_ACTIVE == false) {
        $(".button").css("background", "#C54245");
        $("#participationButton").text("Not Participating");
    }
}

function snowAction() {
    if (IS_ACTIVE == false) {
        IS_ACTIVE = true;
        $(".button").css("background", "#007502");
        $("#participationButton").text("Participating");
    } else {
        IS_ACTIVE = false;
        $(".button").css("background", "#C54245");
        $("#participationButton").text("Not Participating");
    }
    updateBackendActiveField();
}

function updateBackendActiveField() {
    var stringData = JSON.stringify({
                                   userId: CURRENT_USER_ID,
                                   isActive:  IS_ACTIVE
                               });
    console.log("sending reply message: " + stringData);
    $.ajax({
        url: BASE_URL + '/user/active',
        type: 'PUT',
        data: stringData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data) {},
        error: function() {}
    });
}

function addRejectGifteeButton() {
    $("#homeDiv").append(`
        <div class="col-md-12" id="rejectGifteeDiv">
            <div class="col-md-12">
                <button id="rejectGifteeButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>EXCLUDE GIFTER</button>
            </div>
            <div id="rejectListDiv"></div>
        </div>
    `);
}

function rejectGifteeAction() {
    CURRENT_REJECT_LIST = [];
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/' + CURRENT_USER_ID + '/reject',
        success: function(result){
            $.each(result, function(index, type) {
                CURRENT_REJECT_LIST.push(type.rejectUserId);
                console.log(CURRENT_REJECT_LIST);
            });
            displayUsers();
        },
        error: function() {
        }
    });
}

function displayUsers() {
    SELECTED_LIST_ITEM = [];
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/findAllActive',
        success: function(result){
            var inputTextHtml = '<div class="list-group"><h2 style="color:#ffffff;margin-top:7px;">Select Gifter(s) whom you wish to not include in Secret Santa:</h2>';
            $.each(result, function(index, type) {
                var userId = type.userId;
                var name = type.firstName.charAt(0).toUpperCase() + type.firstName.slice(1).toLowerCase() + ' ' +
                                           type.lastName.charAt(0).toUpperCase() + type.lastName.slice(1).toLowerCase();
                CURRENT_OTHER_USER_ID_TO_NAME_MAP.set(userId, name);
                if (CURRENT_REJECT_LIST.includes(type.userId)) {
                    inputTextHtml = inputTextHtml + '<a href="#" id="' + userId +
                        '" class="list-group-item list-group-item-action active"><h3>' + name + '</h3></a>';
                    SELECTED_LIST_ITEM.push(userId);
                } else {
                    inputTextHtml = inputTextHtml + '<a href="#" id="' + userId +
                        '" class="list-group-item list-group-item-action"><h3>' + name + '</h3></a>';
                }
            });
            inputTextHtml += '</div>';
            console.log(CURRENT_OTHER_USER_ID_TO_NAME_MAP);
            $("#rejectListDiv").append(inputTextHtml);
            setListFunctionality("updateActiveUser");
            $('#rejectGifteeButton').text('CLOSE');
            $('#rejectGifteeButton').attr("id","closeRejectGifteeButton");
            $('#closeRejectGifteeButton').attr("style", "background-color:#C54245;");
        },
        error: function() {
        }
    });
}

function updateActiveUser() {
    if (CURRENT_REJECT_LIST.length < SELECTED_LIST_ITEM.length) {
        for (var i = 0 ; i < SELECTED_LIST_ITEM.length ; i++) {
            var selectedItemUserId = parseInt(SELECTED_LIST_ITEM[i]);
            if (!CURRENT_REJECT_LIST.includes(selectedItemUserId)) {
                linkUserToReject(selectedItemUserId);
                CURRENT_REJECT_LIST.push(selectedItemUserId);
            }
        }
    } else {
        for (var i = 0 ; i < CURRENT_REJECT_LIST.length ; i ++) {
            var rejectToRemoveId = CURRENT_REJECT_LIST[i];
            if (!SELECTED_LIST_ITEM.includes(rejectToRemoveId)) {
                removeRejectIdFromUser(rejectToRemoveId);
                CURRENT_REJECT_LIST.splice(CURRENT_REJECT_LIST.indexOf(rejectToRemoveId), 1);
            }
        }
    }
}

function linkUserToReject(selectedItemUserId) {
    var stringData = JSON.stringify({
                                   userId: CURRENT_USER_ID,
                                   rejectUserId: selectedItemUserId
                               });
    console.log("sending reply message: " + stringData);
    $.ajax({
        url: BASE_URL + '/user/reject',
        type: 'POST',
        data: stringData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data) {
        },
        error: function() {}
    });
}

function removeRejectIdFromUser(rejectToRemoveId) {
    $.ajax({
        type: 'DELETE',
        url: BASE_URL + '/user/' + CURRENT_USER_ID + '/reject/' + rejectToRemoveId,
        success: function(result){
        },
        error: function() {
        }
    });
}

function closeRejectGifteeAction() {
    $("#rejectListDiv").empty();
    $('#closeRejectGifteeButton').text('EXCLUDE GIFTER');
    $('#closeRejectGifteeButton').attr("id","rejectGifteeButton");
    $('#rejectGifteeButton').attr("style", "background-color:#007502;");

}

function addGiftee() {
    $("#homeDiv").append(`
        <div class="col-md-12" id="gifteeDiv">
            <div class="col-md-12" id="recipientDiv">
                <h3 id="giftee"></h3>
            </div>
        </div>
    `);
    populateGifteeBox();
}

function populateGifteeBox() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/' + CURRENT_USER_ID + '/recipient',
        success: function(result){
            CURRENT_RECIPIENT_USER_ID = parseInt(result.userId);
            var name = result.firstName.charAt(0).toUpperCase() + result.firstName.slice(1).toLowerCase() + ' ' +
                  result.lastName.charAt(0).toUpperCase() + result.lastName.slice(1).toLowerCase();
            CURRENT_OTHER_USER_ID_TO_NAME_MAP.set(CURRENT_RECIPIENT_USER_ID, name);
            $('#giftee').text('Your Secret Santa Recipient is: ' + name);
            addButtonForRecipient();
        },
        error: function() {
        }
    });
}

function addButtonForRecipient() {
    $("#gifteeDiv").append(`
        <div class="col-md-12">
            <button id="recipientWishListButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>Their WishList</button>
        </div>
    `);
}

function recipientWishListAction() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/' + CURRENT_RECIPIENT_USER_ID + '/wishlist',
        success: function(result){
            var inputText = `
                <div id="recipientWishListInnerDiv">
                <h2 style="color:#ffffff;margin-top:30px;">` + CURRENT_OTHER_USER_ID_TO_NAME_MAP.get(CURRENT_RECIPIENT_USER_ID) + `'s WishList</h2>
            `;
            $.each(result, function(index, type) {
                var wishListItem = type.wishListItem;
                wishListItem = linkify(wishListItem);
                if (!wishListItem.includes("<a")) {
                    wishListItem += '<a href="#" class="list-group-item list-group-item-action">' + wishListItem + '</a>';
                }
                inputText += wishListItem;
            });
            $('#gifteeDiv').append(inputText + '</div>');
            $('#recipientWishListButton').text('CLOSE');
            $('#recipientWishListButton').attr("id","closeRecipientWishListItemButton");
            $('#closeRecipientWishListItemButton').attr("style", "background-color:#C54245;");
        },
        error: function() {
        }
    });
}

function closeRecipientWishListItemAction() {
    $('#gifteeDiv').empty();
    $("#gifteeDiv").append('<div class="col-md-12" id="recipientDiv"><h3 id="giftee"></h3></div>')
    populateGifteeBox();
}

function myWishListItemButton() {
    $("#homeDiv").append(`
        <div class="col-md-12">
            <div class="col-md-12">
                <button id="myWishListButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>My WishList</button>
            </div>
        </div>
    `);
}

function myWishListAction() {
    getWishListItemsFromServer(false);
}

function getWishListItemsFromServer(isAddOpen) {
    clearLocalGlobalVariables();
    $('html, body').animate({scrollTop: '0px'}, 300);
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/user/' + CURRENT_USER_ID + '/wishlist',
        success: function(resultList){
            $.each(resultList, function(index, type) {
                WISH_LIST_MAP.set(type.wishListId, type.wishListItem);
            });
            displayWishListItems(isAddOpen);
        },
        error: function() {
        }
    });

    console.log(WISH_LIST_MAP)
}

function displayWishListItems(isAddOpen) {
    var input = $("#homeDiv");
    input.empty();
    SELECTED_MESSAGE_LIST = 0;
    var inputTextHtml = '<div class="list-group"><h2 style="color:#ffffff;margin-top:5px;">My Wishlist:</h2>';
    var inputTextHtml = '<div class="list-group"><h2 style="color:#ffffff;margin-top:5px;">My Wishlist:</h2>';
    if (WISH_LIST_MAP.size > 0) {
        for (let [key, value] of WISH_LIST_MAP) {
            inputTextHtml = inputTextHtml + '<a href="#" id="' + key +
                '" class="list-group-item list-group-item-action"><h3>' + value + '</h3></a>';
        }
    } else {
        createWishListItemAction();
    }
    inputTextHtml = inputTextHtml + '</div>';
    input.append(inputTextHtml);
    addWishListItemButtons(isAddOpen);
    setListFunctionality('addItemOrEditItem');
    if(isAddOpen) {
        createWishListItemAction();
    }
}

function addWishListItemButtons(isAddOpen) {
    var inputText = '<div class="col-md-12">';
    inputText += `
        <button id="removeWishListItemButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>DELETE</button>
    `;
    if (!isAddOpen) {
        inputText += `
            <button id="createWishListItemButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>ADD ITEM</button>
            <button id="cancelWishListItemButton"  type="button" class="btn btn-lg btn-block btn-info" onClick=linkClick(this.id)>
            <div class="col-md-12"><img src="img/home.jpg"></div>
            </button>
        `}
    inputText += '</div>';
    $("#homeDiv").append(inputText);
}

function createWishListItemAction() {
    $('#createWishListItemButton').remove();
    $('#cancelWishListItemButton').remove();
    addWishListItemToDiv();
}

function editWishListItemAction() {
    if (SELECTED_LIST_ITEM.length > 1) {
        alert("You can only edit 1 item at a time!")
    } else {
        createUpdateWishListDiv();
    }
}

function createUpdateWishListDiv() {
    $("#homeDiv").empty();
    $("#homeDiv").append(`
    <div id="wishListDiv">
        <div id="replyBox" class="form-group">
            <div class="col-md-12">
                <textarea class="form-control" id="updateWishListItemTextArea" rows="6">` + WISH_LIST_MAP.get(parseInt(SELECTED_LIST_ITEM[0])) + `</textarea>
            </div>
            <div class="col-md-12">
                <button id="updateWishListItemButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>UPDATE</button>
                <button id="clearUpdateWishListItemTextButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>CLEAR</button>
                <button id="returnToWishListItemTextButton"  type="button" class="btn btn-lg btn-block btn-info" onClick=linkClick(this.id)>RETURN</button>
            </div>
        </div>
    </div>
    `);
}

function updateWishListItemAction() {
    updateWishListBackend();
}

function returnToWishListItemTextAction() {
    getWishListItemsFromServer(false);
}

function updateWishListBackend() {
    var stringData = JSON.stringify({
                                   userId: CURRENT_USER_ID,
                                   wishListId: parseInt(SELECTED_LIST_ITEM[0]),
                                   wishListItem: $("#updateWishListItemTextArea").val()
                               });
    console.log("sending update : " + stringData);
    $.ajax({
        url: BASE_URL + '/wishlist/update',
        type: 'PUT',
        data: stringData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data) {
            getWishListItemsFromServer(false);
        },
        error: function() {
            alert("Ran into an error while attempting to update.  Please try again later or yell at Mark");
            getWishListItemsFromServer(false);
        }
    });
}

function addWishListItemToDiv() {
    $("#homeDiv").append(`
    <div id="wishListDiv">
        <div id="replyBox" class="form-group">
            <div id="wishListItemTextArea" class="col-md-12">
                <textarea class="form-control" id="wishListTextArea" rows="6"></textarea>
            </div>
            <div class="col-md-12">
                <button id="addWishListItemButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>ADD</button>
                <button id="clearWishListItemTextButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>CLEAR</button>
                <button id="cancelWishListAddItemTextButton"  type="button" class="btn btn-lg btn-block btn-info" onClick=linkClick(this.id)>RETURN</button>
            </div>
        </div>
    </div>
    `);
    $('#wishListTextArea').focus();
}

function addWishListItemAction() {
    if (confirm("Please select OK in order to submit your wish list item(s).")) {
        var stringData = JSON.stringify({
                                       wishListItem: $("#wishListTextArea").val()
                                   });
        console.log("sending reply message: " + stringData);
        $.ajax({
            url: BASE_URL + '/user/' + CURRENT_USER_ID + '/wishlist/create',
            type: 'POST',
            data: stringData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function(data) {
                clearItem();
                getWishListItemsFromServer(true);
            },
            error: function() {}
        });
    }
}

function removeWishListItemAction() {
    if (confirm("Press Ok to delete selected messages.")) {
        for (var i = 0 ; i < SELECTED_LIST_ITEM.length ; i++) {
            $.ajax({
                type: 'DELETE',
                url: BASE_URL + '/user/' + CURRENT_USER_ID + '/wishlist/delete/' + SELECTED_LIST_ITEM[i],
                success: function(resultList){
                    $("#homeDiv").empty();
                    getWishListItemsFromServer(false);
                },
                error: function() {
                }
            });
        }
    }
}

function clearWishListItemTextAction() {
    if (confirm("Are you sure you want to clear the text?")) {
        clearItem();
    }
}

function clearItem() {
    $('#wishListTextArea').val('');
    $("#wishListTextArea").focus();
}

function addItemOrEditItem() {
    if(SELECTED_LIST_ITEM.length > 0) {
        $('#createWishListItemButton').text('EDIT');
        $('#createWishListItemButton').attr("id","editWishListItemButton");
    } else {
        $('#editWishListItemButton').text('ADD ITEM');
        $('#editWishListItemButton').attr("id","createWishListItemButton");
    }
}

function cancelWishListItemAction() {
    loadHome();
}
function cancelWishListAddItemTextAction() {
    getWishListItemsFromServer(false);
}
