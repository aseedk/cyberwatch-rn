import * as React from 'react';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {Image, NativeModules, SafeAreaView, ScrollView, Text, ToastAndroid} from "react-native";
import styles from "../styles/global";
import { Settings, LoginButton, AccessToken } from 'react-native-fbsdk-next';
import {Button, Headline} from "react-native-paper";
import RNSecureStore, {ACCESSIBLE} from "react-native-secure-store";

const { RNTwitterSignIn } = NativeModules
Settings.initializeSDK();

const Constants = {
    TWITTER_CONSUMER_KEY: "4aNp2JGbx8eDXMvJzhjyWU8lf",
    TWITTER_CONSUMER_SECRET: "QgJbqWNRMjGamwDLbvaim9z3HcZe4OVRjFDnHdwMMAXDhHci0l",
}
RNTwitterSignIn.init(Constants.TWITTER_CONSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET)
const LinkSocialMedia = ({navigation}) =>{
    const [facebookAccessToken, setFacebookAccessToken] = React.useState('');
    const [twitterAccessToken, setTwitterAccessToken] = React.useState('');
    const [twitterAccessTokenSecret, setTwitterAccessTokenSecret] = React.useState('');

    const handleFacebookLogin = (error, result) => {
        if (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        } else if (result.isCancelled) {
            ToastAndroid.show('Login cancelled', ToastAndroid.SHORT);
        } else {
            AccessToken.getCurrentAccessToken().then(
                (data) => {
                    setFacebookAccessToken(data.accessToken.toString());
                    ToastAndroid.show('Login success', ToastAndroid.SHORT);
                }
            )
        }
    }
    const handleTwitterLogin = () => {
        RNTwitterSignIn.logIn()
            .then(loginData => {
                if (loginData.authToken && loginData.authTokenSecret) {
                    setTwitterAccessToken(loginData.authToken);
                    setTwitterAccessTokenSecret(loginData.authTokenSecret);
                    ToastAndroid.show('Logged in!', ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('Login failed!', ToastAndroid.SHORT);
                }
            })
            .catch(error => {
                console.log('error', error);
            });
    };
    const handleLinkSocialMedia = () => {
        if (
            facebookAccessToken &&
            twitterAccessToken &&
            twitterAccessTokenSecret
        ){
            const user = auth().currentUser;

            firestore().collection('Users').doc(user.uid)
                .update({
                    facebookAccessToken: facebookAccessToken,
                    twitterAccessToken: twitterAccessToken,
                    twitterAccessTokenSecret: twitterAccessTokenSecret,
                })
                .then(async () => {
                    const userDoc = await firestore().collection('Users').doc(user.uid).get();
                    let tempUser = userDoc.data();
                    tempUser.id = userDoc.id;
                    RNSecureStore.set(
                        'user',
                        JSON.stringify(tempUser),
                        ACCESSIBLE
                    ).then(() => {
                        navigation.navigate('Dashboard');
                        ToastAndroid.show('Social Media Account Linked Successfully', ToastAndroid.SHORT);
                    });
                })
                .catch(error => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                });
        }else {
            ToastAndroid.show('Please Login to all social media accounts', ToastAndroid.SHORT);
        }
        console.log(facebookAccessToken);
        console.log(twitterAccessToken);
        console.log(twitterAccessTokenSecret);
    };
    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <Headline style={{textAlign: 'center', fontWeight: 'bold'}}>
                    Connect your social media account
                </Headline>
                <Image source={require('../assets/welcome.png')} style={{ width: 200, height: 200, alignSelf:'center' }} />
                <LoginButton
                    onLoginFinished={handleFacebookLogin}
                    onLogoutFinished={() => ToastAndroid.show('Account Logged Out', ToastAndroid.SHORT)}
                    style={{width:'100%', height:35, marginVertical:10}}

                />
                <Button mode="contained"
                        onPress={handleTwitterLogin}
                        style={{marginVertical:10}}
                >
                    Login with Twitter
                </Button>
                <Button mode="contained"
                        style={{marginVertical:10}}
                        onPress={handleLinkSocialMedia}
                >
                    Continue to Dashboard
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}
export default LinkSocialMedia;
