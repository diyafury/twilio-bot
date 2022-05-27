require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const twilio = require('twilio');

console.log(process.env);

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);
const MessagingResponse = twilio.twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

async function retrieveRandom() {
    try {
        let res = await axios.get('https://random-data-api.com/api/hipster/random_hipster_stuff?size=1');
        const data = res.data[0];
        return data;  
    } catch (error) {
        console.error(`Could not save the Ghibli movies to a file: ${error}`);
        return `Sorry, Hipster has no come-back at this time! Unbelievable, yes!`;
    }
}

app.post('/req', (req, res) => {
    const MR = new MessagingResponse();
    async function respond() {
      const data = await retrieveRandom();
      let msg = MR.message( data.sentence );
      //let msg = MR.message('You said: ' + req.body.Body);
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(MR.toString());
      //console.log(req.body);
    }
    respond();
});

app.get('/', (req, res) => {
    res.send(`Welcome! I'm Hipster, I make so much sence it hurts. Let's chat.`);
});

app.listen(3000);