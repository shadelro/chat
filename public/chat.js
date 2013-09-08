$(function() {
  var $content = $('#content'),
      $input = $('#input'),
      $status = $('#status'),
      myColor = false,
      myName = false;

  window.WebSocket = window.WebSocket || window.MozWebSocket;

  if (!window.WebSocket) {
    $content.html($("<p>Sorry, but your browser doesn't support WebSockets.<p>"));
    $input.hide();
    $('span').hide();
    return;
  }
  
  var connection = new WebSocket('ws://70.94.3.23:1337');
  connection.onopen = function() {
    $input.removeAttr('disabled');
    $status.text('Choose a name:');
  };

  connection.onerror = function(error) {
    $content.html($("<p>Sorry, but there's a problem with your connection or the server is down.</p>"));
  };

  connection.onmessage = function(message) {
    try {
      var json = JSON.parse(message.data);
    } catch(e) {
      console.log("This doesn't look like valid JSON: " + message.data);
      return;
    }

    if (json.type === 'color') {
      myColor = json.data;
      $status.text(myName + ': ').css('color', myColor);
      $input.removeAttr('disabled').focus();
    } else if (json.type === 'history') {
      for (var i = 0; i < json.data.length; i++) {
        addMessage(json.data[i].author, json.data[i].text, jsondata[i].color, new Date(json.data[i].time));
      }
    } else if (json.type === 'message') {
      $input.removeAttr('disabled');
      addMessage(json.data.author, json.data.text, json.data.color, new Date(json.data.time));
    } else {
      console.log("Hmmm...I've never seen JSON like this: " + json);
    }
  };

  $input.keydown(function(e) {
    // stub
    if (e.keyCode === 13) {
      var msg = $(this).val();
      if (!msg) {
        return;
      }

      connection.send(msg);
      $(this).val('');

      $input.attr('disabled', 'disabled');

      if (myName === false) {
        myName = msg;
      }
    }
  });

  function addMessage(author, message, color, dt) {
    $content.prepend(
      '<p><span style="color: ' + color + '">' + author + '</span> @ '
      + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
      + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
      + ': ' + message + '</p>'
    );
  }
});

