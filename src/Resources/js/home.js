var IS_ACTIVE = false;
var WISH_LIST_MAP = new Map();

function loadHome() {
    console.log("CURRENT_USER_ID: " + CURRENT_USER_ID + " jsFile: home");
    collapseNavbar();
    $('html, body').animate({scrollTop: '0px'}, 300);
    clearLocalGlobalVariables();
    setNavigationActive("home", "inbox", "otherGifters");
    $("#navigation").show();
    clearAllDivs();
    addOptInToggle();
}

function clearLocalGlobalVariables() {
    WISH_LIST_MAP = new Map();
    SELECTED_LIST_ITEM = [];
}
function addOptInToggle() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + '/users/' + CURRENT_USER_ID,
        success: function(result){
            var isActive = result.isActive;
            if (isActive == null) {
               isActive = false
            }
            IS_ACTIVE = isActive
            addOptInToggleToDiv();
            myWishListItemButton() ;
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
        url: BASE_URL + '/users/active',
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


function myWishListItemButton() {
    $("#homeDiv").append(`
        <div class="col-md-12">
            <button id="myWishListButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>My WishList</button>
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
    var inputTextHtml = '<div class="list-group">';
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
            <button id="cancelWishListItemButton"  type="button" class="btn btn-lg btn-block btn-info" onClick=linkClick(this.id)>RETURN</button>
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
                <textarea class="form-control" id="updateWishListItemTextArea" rows="6">` +WISH_LIST_MAP.get(parseInt(SELECTED_LIST_ITEM[0])) + `</textarea>
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