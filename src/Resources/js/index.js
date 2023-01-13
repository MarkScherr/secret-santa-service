var CURRENT_USER_ID = -1;

function linkClick(id) {
    $('#sound').append('<audio autoplay><source src="sound/smb/smb3_enter_level.wav" type="audio/wav"></audio>');
    name = id.slice(0, -6);
    window[name + "Action"]();
} 

function clearAllDivs() {
    $("#enterSiteDiv").empty();
    $("#inboxDiv").empty();
    $("#homeDiv").empty();
    $("#otherGiftersDiv").empty();
}

function setNavigationActive(currentTab, otherTab1, otherTab2) {
    if($("#" + otherTab1 + "li").hasClass('active')) {
        $("#" + otherTab1 + "li").removeClass('active');
    }
    if($("#" + otherTab2 + "li").hasClass('active')) {
        $("#" + otherTab2 + "li").removeClass('active');
    }
    $("#" + currentTab + "li").addClass('active');
}

function collapseNavbar() {
    $(".navbar-toggler").addClass('collapsed');
    $("#navbarSupportedContent15").removeClass('show');

}
