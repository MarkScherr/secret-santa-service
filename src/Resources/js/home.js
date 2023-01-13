var IS_ACTIVE = false;
function loadHome() {
    console.log("CURRENT_USER_ID: " + CURRENT_USER_ID + " jsFile: home");
    setNavigationActive("home", "inbox", "otherGifters");
    $("#navigation").show();
    clearAllDivs();
    addOptInToggle();
}

function addOptInToggle() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/users/' + CURRENT_USER_ID,
        success: function(result){
            var isActive = result.isActive;
            if (isActive == null) {
               isActive = false
            }
            IS_ACTIVE = isActive
            addOptInToggleToDiv();
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
        url: 'http://localhost:8080/users/active',
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
