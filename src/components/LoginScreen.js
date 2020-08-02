import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '385553591869-v0gvsfvnmi9402kmb2g5fjrt1ba5f6s7.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  useEffect(() => {
    console.log("User", userInfo);
  });

    const _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const {accessToken, idToken} = await GoogleSignin.signIn();
            setLoggedIn(true);

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                alert('Cancel');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('PLAY_SERVICES_NOT_AVAILABLE');
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    const _signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setLoggedIn(false);
            setUserInfo([]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={_signIn}
            />
          <View style={styles.buttonContainer}>
            {!userInfo && <Text>You are currently logged out</Text>}
            {userInfo && (
              <View>
                <Text>Welcome {userInfo.displayName}</Text>
                <Button
                  onPress={_signOut}
                  title="LogOut"
                  color="red"/>
              </View>
            )}
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default LoginScreen;
