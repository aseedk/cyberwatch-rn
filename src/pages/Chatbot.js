import * as React from 'react';
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {Button, Headline, Subheading} from "react-native-paper";
import axios from "axios";
import RNSecureStore from "react-native-secure-store";
import styles from "../styles/global";
import { useTwitter } from "react-native-simple-twitter";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import {GiftedChat} from "react-native-gifted-chat";
const Chatbot = () =>{
    const [messages, setMessages] = React.useState([
        {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
            },
        },
        {
        _id: 2,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: auth().currentUser.uid,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
            },
        },
    ]);
    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <Text>
                    Chat bot
                </Text>
                <GiftedChat
                    messages={messages}
                    user={{
                        _id: auth().currentUser.uid,
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
export default Chatbot;
