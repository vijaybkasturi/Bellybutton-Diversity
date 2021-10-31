function loadAuthClient () {
  console.log('Loading Auth Client');
  gapi.load('auth2', initGoogleAuth);
}

function initGoogleAuth (clientId = '216353090233-mc2hiucjjmlroumidovtms310kll3iek.apps.googleusercontent.com') {
  console.log('Initialize Google Auth');
  gapi.auth2.init({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/userinfo.email'
  }).then(() => {
    document.getElementById('sign-in-btn').disabled = false;
    console.log('Sign in button enabled');
  }).catch(err => {
    console.log(err);
  });
}

function signIn () {
  console.log('Signing In');
  gapi.auth2.getAuthInstance().signIn().then(() => {
    document.getElementById('sign-in-btn').hidden = true;
    document.getElementById('sign-out-btn').hidden = false;
    document.getElementById('send-request-btn').disabled = false;
    console.log('Sign in button hidden');
    console.log('Sign out button Enabled');
    console.log('Send Request button Enabled');
  }).catch(err => {
    console.log(err);
  });
}

function sendSampleRequest (projectId = 'testgsheetsintegration') {
  console.log('Sending Sample Request');
  var user = gapi.auth2.getAuthInstance().currentUser.get();
  var idToken = user.getAuthResponse().id_token;
  var endpoint = `https://${projectId}.appspot.com/_ah/api/echo/v1/email`;
  
  console.log('Current user is: ', user);
  console.log('idToken is: ', idToken);
  console.log('end point is: ', endpoint);
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '?access_token=' + encodeURIComponent(idToken));
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      window.alert(xhr.responseText);
    }
  };
  xhr.send();
}

