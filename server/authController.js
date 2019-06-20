module.exports = (client, fetch) => {
  return {
    googleSignIn(req, res, next) {
      const { token } = req.body;
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
        fetch
          .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
          .then(({ data }) => (res.locals.googleSession = data))
          .catch(error => {
            console.log(error);
          });
        return next();
      }
      verify().catch(console.error);
    },
  };
};
