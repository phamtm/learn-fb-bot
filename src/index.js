const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const token =
  'EAACk46ZB0vAYBACZCliff4dFNxl7CmZC25ZBZAl6J6GAw9qIlcHCGaD5L1ow8MOgK7nRwDdNtjdMFKicQvhZCdaXN9ev8tOBu8hLIZArJX3y73A213MsBIgddAMxJoGpUPcEGyWtpjSgMlEscHQcZCVZBexrrl0y95SMVTP3uW4qc0QZDZD';
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('hello world i am a secret bot');
});

// for facebook verification
app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong token');
  }
});

// to post data
app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      if (text === 'Generic') {
        continue;
      }
      sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  let messageData = { text: text };

  request(
    {
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: token },
      method: 'POST',
      json: {
        recipient: { id: sender },
        message: messageData,
      },
    },
    function(error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    }
  );
}

app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'));
});
