module.exports = (client, fetch) => {
  return {
    googleSignIn() {
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
        fetch
          .get('https://oauth2.googleapis.com/tokeninfo?id_token=XYZ123')
          .then(({ data }) => console.log(data));
      }
      verify().catch(console.error);
    },
  };
};
