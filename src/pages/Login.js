import * as React from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNSecureStore, {ACCESSIBLE} from "react-native-secure-store";
import {Image, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {HelperText, TextInput, Button} from 'react-native-paper';
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import styles from "../styles/global";
import {validateEmail, validatePassword} from "../hooks/syntax";
import {delay} from "../hooks/common";

GoogleSignin.configure({
    webClientId: '368074010531-gmgeucsvkppd359bseojqltv2gtrp33n.apps.googleusercontent.com',
});

function Login({navigation}) {
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const onChangeEmail = async (email) => {
        setEmail(email);
        await delay(1000);
        if (email === "") {
            setEmailError(false);
        } else if (!validateEmail(email)) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    }
    const onChangePassword = async (password)=>{
        setPassword(password);
        await delay(1000);
        if (password === ''){
            setPasswordError(false);
        }else if(!validatePassword(password)){
            setPasswordError(true);
        }else {
            setPasswordError(false);
        }
    }
    const [eye, setEye] = React.useState(false);

    const handleLogin = () =>{
        if (
            email !== "" && password !== "" &&
            !emailError && !passwordError
        ){
            auth().signInWithEmailAndPassword(email, password)
                .then((user) => {
                    firestore().collection('Users').doc(user.user.uid).get()
                        .then((userDoc)=>{
                            if(
                                userDoc.get('facebookAccessToken') === undefined &&
                                userDoc.get('twitterAccessToken') === undefined &&
                                userDoc.get('twitterAccessSecret') === undefined
                            ){
                                navigation.navigate("LinkSocialMedia");
                            }else {
                                navigation.navigate('Dashboard');
                            }
                            ToastAndroid.show('User account signed in!', ToastAndroid.SHORT);
                        });
                })
                .catch(function(error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        ToastAndroid.show('Incorrect password', ToastAndroid.LONG);
                    } else if(errorCode === 'auth/user-not-found') {
                        ToastAndroid.show('User account doesnt exists', ToastAndroid.LONG);
                    } else if (errorCode === 'auth/invalid-email') {
                        ToastAndroid.show('That email address is invalid!', ToastAndroid.LONG);
                    } else if (errorCode === 'auth/user-disabled') {
                        ToastAndroid.show('That user account is disabled', ToastAndroid.LONG);
                    }
                    else {
                        alert(errorMessage);
                    }
                    ToastAndroid.show(error.toString(), ToastAndroid.LONG);
                });
        } else {
            ToastAndroid.show('Check login fields', ToastAndroid.SHORT);
        }
    }
    const handleGoogleLogin = async () => {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        auth().signInWithCredential(googleCredential)
            .then((user) => {
                firestore().collection('Users').doc(user.user.uid).get()
                    .then((userDoc)=>{
                        if(userDoc.exists){
                            let tempUser = userDoc.data();
                            tempUser.id = userDoc.id;
                            RNSecureStore.set(
                                'user',
                                JSON.stringify(tempUser),
                                ACCESSIBLE
                            );
                            if (
                                userDoc.get('dateOfBirth') === undefined &&
                                userDoc.get('country')  === undefined &&
                                userDoc.get('gender') === undefined
                            ){
                                navigation.navigate('UpdateProfileGoogle');
                            } else if(
                                userDoc.get('facebookAccessToken') === undefined &&
                                userDoc.get('twitterAccessToken') === undefined &&
                                userDoc.get('twitterAccessSecret') === undefined
                            ){
                                navigation.navigate("LinkSocialMedia");
                            }else {
                                navigation.navigate('Dashboard');
                            }
                            ToastAndroid.show('User account Logged in!', ToastAndroid.SHORT);
                        }else{
                            firestore().collection('Users').doc(user.user.uid).set({
                                email: user.user.email,
                                name: user.user.displayName,
                            })
                                .then(()=>{
                                    firestore().collection('Users').doc(user.user.uid).get()
                                        .then((userDoc)=>{
                                            let tempUser = userDoc.data();
                                            tempUser.id = userDoc.id;
                                            RNSecureStore.set(
                                                'user',
                                                JSON.stringify(tempUser),
                                                ACCESSIBLE
                                            );
                                            navigation.navigate('UpdateProfileGoogle');
                                            ToastAndroid.show('User account registered!', ToastAndroid.SHORT);
                                        });
                                })
                                .catch(function(error) {
                                    console.log(error);
                                });
                        }
                    });
            })
    }
  return (
      <SafeAreaView style={styles.mainView}>
          <ScrollView style={styles.bodyView}>
              <Image source={require('../assets/cyberwatch1.png')} style={{ width: 200, height: 200, alignSelf:'center' }} />
              <TextInput
                  label="Email"
                  placeholder={"Enter your Email"}
                  mode={'outlined'}
                  value={email}
                  error={emailError}
                  onChangeText={onChangeEmail}
              />
              <HelperText type="error" visible={emailError}>
                  Email address is invalid!
              </HelperText>
              <TextInput
                  label={"Password"}
                  placeholder={"Enter Your Password"}
                  mode={"outlined"}
                  value={password}
                  onChangeText={onChangePassword}
                  secureTextEntry={eye}
                  error={passwordError}
                  right={<TextInput.Icon name={"eye"}  onPress={()=>{setEye(!eye)}}/>}
              />
              <HelperText type="error" visible={passwordError}>
                  Password Syntax is invalid
              </HelperText>
              <Text style={{textAlign:'right', fontWeight:'bold', marginBottom:10}}
                    onPress={()=>{navigation.navigate('ForgotPassword')}}>
                  Forgot Password?
              </Text>
              <Button mode="contained" onPress={handleLogin}>
                  Login
              </Button>
              <View
                  style={{
                      marginVertical: 20,
                      borderBottomColor: 'black',
                      borderBottomWidth: 1,
                  }}
              />
              <GoogleSigninButton
                  style={{ width: '100%' }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={handleGoogleLogin}
              />
              <TouchableOpacity style={{flexDirection:'row', marginTop:40, justifyContent:'center', marginBottom:20}}
                                onPress={()=> navigation.navigate('Register')}>
                  <Text>Don't have an account? </Text>
                  <Text style={{color:'tomato'}}>Sign Up</Text>
              </TouchableOpacity>
          </ScrollView>
      </SafeAreaView>
  );
}
export default Login;
