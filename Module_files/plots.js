function loadAuthClient () {
  gapi.load('auth2', initGoogleAuth);
}

function initGoogleAuth (clientId = '216353090233-mc2hiucjjmlroumidovtms310kll3iek.apps.googleusercontent.com') {
  gapi.auth2.init({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/userinfo.email'
  }).then(() => {
    document.getElementById('sign-in-btn').disabled = false;
  }).catch(err => {
    console.log(err);
  });
}

function signIn () {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    document.getElementById('sign-in-btn').hidden = true;
    document.getElementById('sign-out-btn').hidden = false;
    document.getElementById('send-request-btn').disabled = false;
  }).catch(err => {
    console.log(err);
  });
}

function sendSampleRequest (projectId = 'testgsheetsintegration') {
  var user = gapi.auth2.getAuthInstance().currentUser.get();
  var idToken = user.getAuthResponse().id_token;
  var endpoint = `https://${projectId}.appspot.com/_ah/api/echo/v1/email`;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint + '?access_token=' + encodeURIComponent(idToken));
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      window.alert(xhr.responseText);
    }
  };
  xhr.send();
}

// Sort the data array using the greekSearchResults value
data.sort(function(a, b) {
  return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
});

// Slice the first 10 objects for plotting
data = data.slice(0, 10);

// Reverse the array due to Plotly's defaults
data = data.reverse();

// Trace1 for the Greek Data
var trace1 = {
  x: data.map(row => row.greekSearchResults),
  y: data.map(row => row.greekName),
  text: data.map(row => row.greekName),
  name: "Greek",
  type: "bar",
  orientation: "h"
};

// data
var data = [trace1];

// Apply the group bar mode to the layout
var layout = {
  title: "Greek gods search results",
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  }
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", data, layout);
