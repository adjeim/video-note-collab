require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const AccessToken = require('twilio').jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;

// Return index.html at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/token', (req, res) => {
  // For demonstration purposes, each session has the same identity
  const identity = 'contributor'

  // Create a 'grant' identifying the Sync service instance for this app.
  const syncGrant = new SyncGrant({
    serviceSid: process.env.TWILIO_SYNC_SERVICE_SID
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created and specifying their identity.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
  );

  token.addGrant(syncGrant);
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