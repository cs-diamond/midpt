import React, { useEffect } from 'react';

const GoogleAuth = props => {
  const {
    initGoogleAuth,
    signOut,
    signedInUserEmail,
    signedInUserFirstName,
    signedInUserProfilePic,
  } = props;
  useEffect(() => {
    initGoogleAuth();
  }, []);
  return (
    <div className="googleAuthContainer">
      {signedInUserEmail ? (
        <React.Fragment>
          <img
            className="userProfilePicture"
            src={signedInUserProfilePic}
            alt="Profile Picture"
          />
          <span className="userFirstName">{signedInUserFirstName}</span>
          <button className="signOutButton" onClick={signOut}>
            Sign out
          </button>
        </React.Fragment>
      ) : (
        <div id="google-signin" />
      )}
    </div>
  );
};

export default GoogleAuth;
