function loginAction() {
    console.log("login");
    clearAllDivs();
    input = $("#enterSiteDiv");
    input.append(`
        <div class="input-group input-group-lg">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-lg">username</span>
          </div>
          <input type="text" id="userNameInput"class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
        </div>
        <div class="input-group input-group-lg">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-lg">password</span>
          </div>
          <input type="text" id="passwordInput" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
        </div>

        <div class="col-md-12">
            <button id="loginWithCredentialsButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>login</button>
            <button id="returnButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>return</button>
        </div>
    `);
}

function loginWithCredentialsAction() {
    var stringData = JSON.stringify({
//                                   userName: $("#userNameInput").val(),
//                                   password:  $("#passwordInput").val()
                                   userName: "mrscherr",
                                   password:  "rrugby"
                               });
                               console.log(stringData);
     $.ajax({
        url: 'http://localhost:8080/credential/verify',
        type: 'POST',
        data: stringData,
        crossDomain: true,
        beforeSend: function(xhr){
                xhr.withCredentials = true;
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        success: function(data, status) {
            console.log(data);
            if (data == -1) {
                loginAction();
            } else {
                CURRENT_USER_ID = parseInt(data);
                startApplication();
            }
        },
        error: function() {
             loginAction();
        }
    });
}

function signUpAction() {
    clearAllDivs();
    input = $("#enterSiteDiv");
    input.append(`
    <div class="input-group input-group-lg">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-lg">first name</span>
      </div>
      <input type="text" id="firstNameInput"class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
    </div>
    <div class="input-group input-group-lg">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-lg">last name</span>
      </div>
      <input type="text" id="lastNameInput" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
    </div>
    <div class="input-group input-group-lg">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-lg">phone #</span>
      </div>
      <input id="phoneNumberInput" onkeydown="phoneNumberFormatter()" type="text" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
    </div>
    <div class="input-group input-group-lg">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-lg">username</span>
      </div>
      <input type="text" id="userNameInput" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
    </div>
    <div class="input-group input-group-lg">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-lg">password</span>
      </div>
      <input type="text" id="passwordInput"class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" required>
    </div>
    <button id="registerButton"  type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>register</button>
    <button id="returnButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>return</button>

    `)
}

function registerAction() {
    var user = new Map()
    user.set("firstName", $("#firstNameInput").val());
    user.set("lastName", $("#lastNameInput").val());
    user.set("phoneNumber", $("#phoneNumberInput").val());
    user.set("userName", $("#userNameInput").val());
    user.set("password", $("#passwordInput").val());
    console.log(user);
    registerUser(user);
}

function registerUser(user) {
    var phoneNumberParsed = $("#phoneNumberInput").val()
    .replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "");
    var stringData = JSON.stringify({
                                   firstName: $("#firstNameInput").val(),
                                   lastName: $("#lastNameInput").val(),
                                   phoneNumber: phoneNumberParsed,
                                   userName: $("#userNameInput").val(),
                                   password:  $("#passwordInput").val()
                               });
                               console.log(stringData);
     $.ajax({
        url: 'http://localhost:8080/credential/create',
        type: 'POST',
        data: stringData,
        crossDomain: true,
        beforeSend: function(xhr){
                xhr.withCredentials = true;
          },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        success: function(data, status) {
            CURRENT_USER_ID = parseInt(data);
            startApplication();
        }
    });
}

function returnAction() {
    input = $("#enterSiteDiv");
    input.empty();
    input.append(`
        <button id="loginButton" type="button" class="btn btn-lg btn-block btn-success" onClick=linkClick(this.id)>LOGIN</button>
        <button id="signUpButton"  type="button" class="btn btn-lg btn-block btn-danger" onClick=linkClick(this.id)>SIGN UP</button>
    `);
}

function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
}

function phoneNumberFormatter() {
    const inputField = document.getElementById('phoneNumberInput');
    const formattedInputValue = formatPhoneNumber(inputField.value);
    inputField.value = formattedInputValue;
}

function startApplication() {
    $("#enterSiteDiv").hide();
    loadHome();
}