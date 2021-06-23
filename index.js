require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const AccessToken = require('twilio').jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;
const VideoGrant = AccessToken.VideoGrant;

app.use(express.json());

// Return index.html at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/token', async (req, res) => {
  if (!req.body.identity || !req.body.room) {
    return res.status(400);
  }

  // Get the user's identity from the request
  const identity  = req.body.identity;

  // Create a 'grant' identifying the Sync service instance for this app.
  const syncGrant = new SyncGrant({
    serviceSid: process.env.TWILIO_SYNC_SERVICE_SID
  });

  // Create a video grant
  const videoGrant = new VideoGrant({
    room: req.body.room
  })

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created and specifying their identity.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
  );

  token.addGrant(syncGrant);
  token.addGrant(videoGrant);
  token.identity = identity;

  // Serialize the token to a JWT string and include it in a JSON response
  res.send({
    identity: identity,
    token: token.toJwt()
  });
});

// Start the node.js server
app.listen(port, () => {
  console.log(`Twilio Sync Co-browsing App listening at http://localhost:${port}`);
});