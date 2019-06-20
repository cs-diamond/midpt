import React, { useEffect } from 'react';

const GoogleAuth = props => {
  const { onGoogleSuccess, onGoogleFailure, signOut } = props;
  useEffect(() => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2
        .init({
          client_id:
            '706985961819-lfqvbdctqu7v8a8q868u72qgnm4mltnb.apps.googleusercontent.com',
        })
        .then(() => {
          window.gapi.signin2.render('google-signin', {
            scope: 'profile email',
            width: 250,
            height: 50,
            longtitle: false,
            theme: 'dark',
            onsuccess: onGoogleSuccess,
            onfailure: onGoogleFailure,
          });
        });
    });
  });
  return (
    <div>
      <div id="google-signin" />
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default GoogleAuth;
