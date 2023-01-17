var CURRENT_USER_ID = -1;
var BASE_URL = "http://localhost:8080";
var SELECTED_LIST_ITEM = [];

function linkClick(id) {
    $('#sound').append('<audio autoplay><source src="sound/smb/smb3_enter_level.wav" type="audio/wav"></audio>');
    name = id.slice(0, -6);
    console.log("name: " + name);
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

function setListFunctionality(additionalAction) {
    console.log(additionalAction)
    $('.list-group').on('click', '> a', function(e) {
        var $this = $(this);
        var clickedDivId = $this.attr('id');
        if($this.hasClass('active')) {
            $this.removeClass('active');
            var index = SELECTED_LIST_ITEM.indexOf(clickedDivId);
            if (index == -1) {
                index = SELECTED_LIST_ITEM.indexOf(parseInt(clickedDivId));
            }
            if (index > -1) {
              SELECTED_LIST_ITEM.splice(index, 1);
            }
        } else {
            $this.addClass('active');
            SELECTED_LIST_ITEM.push(clickedDivId);
        }
        e.preventDefault();
        if (additionalAction !== undefined) {
            window[additionalAction]();
        }
    });

    $('.list-group .collapse').on('click', '> a', function(e) {
        var $this = $(this),
        $parent = $this.parent('.collapse');
        $parent.find('.active').removeClass('active');
        $this.addClass('active');
    });
}

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" class="list-group-item list-group-item-action" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" class="list-group-item list-group-item-action">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" class="list-group-item list-group-item-action">$1</a>');

    return replacedText;
}