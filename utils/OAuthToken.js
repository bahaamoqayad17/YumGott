const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

exports.decodeGoogleToken = async (token) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "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",
  });

  const payload = ticket.getPayload();
  const id = payload.sub;
  const email = payload.email;
  const name = payload.name;

  return {
    id,
    email,
    name,
  };
};

exports.decodeFacebookToken = (accessToken) => {
  const decodedToken = jwt.decode(accessToken, { complete: true });

  if (!decodedToken) {
    throw new Error("Invalid access token");
  }

  const { payload } = decodedToken;
  return payload;
};
