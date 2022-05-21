import * as React from 'react';
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {Button, Headline, Subheading} from "react-native-paper";
import axios from "axios";
import RNSecureStore from "react-native-secure-store";
import styles from "../styles/global";
import { useTwitter } from "react-native-simple-twitter";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Carousel from "react-native-snap-carousel";

let url = "http://192.168.18.44:5000/analyze"
const MarketerDetails = ({route}) => {
    const {tweets, search} = route.params
    const c = React.useRef()
    React.useEffect(() =>{
        const getUser = async () => {
            setUser(JSON.parse(await RNSecureStore.get("user")));
        }
        getUser().then(() => console.log("user"));
    }, []);
    const renderSlider = ({item, index}) => {
        return (
            <View style={{paddingHorizontal:4,paddingVertical:8, backgroundColor:'black', justifyContent:'center', borderRadius:10}}>
                <Text style={{color:'white', fontWeight:'bold', fontSize:18, textAlign:'center'}}>ID: {item.id}</Text>
                <Text style={{color:'white', fontWeight:'bold', fontSize:18, textAlign:'center'}}>
                    Sender: {item.user? item.user: "Test"}
                </Text>
                <Text style={{color:'white', fontWeight:'bold', fontSize:18, textAlign:'center'}}>Date: {item.created_at.split("T")[0]}</Text>
                <Text style={{color:'white', fontWeight:'bold', fontSize:18, textAlign:'center'}}>Message: {item.text}</Text>
                <Text style={[{fontWeight:'bold', fontSize:18, textAlign:'center'}, item.analysis["sentiment"] === "Positive"? {color: "lime"}: {color: "red"}]}>
                    Sentiment: {item.analysis["sentiment"]}
                </Text>
                <Text style={[{fontWeight:'bold', fontSize:18, textAlign:'center'}, item.analysis["racism"] === "Negative"? {color: "lime"}: {color: "red"}]}>
                    Racism: {item.analysis["racism"]}
                </Text>
                <Text style={[{fontWeight:'bold', fontSize:18, textAlign:'center'}, item.analysis["sexism"] === "Negative"? {color: "lime"}: {color: "red"}]}>
                    Sexism: {item.analysis["sexism"]}
                </Text>
                <View style={{flexDirection:'row', justifyContent:'center',marginVertical:5}}>
                    <View style={{backgroundColor:'red',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontWeight:'bold',fontSize:20}}>
                            {Math.round((item.analysis["emotion"]["anger"]*100 + Number.EPSILON) * 100) / 100}%
                        </Text>
                        <Text style={{color:'white'}}>
                            Anger
                        </Text>
                    </View>
                    <View style={{backgroundColor:'orange',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>
                            {Math.round((item.analysis["emotion"]["joy"]*100 + Number.EPSILON) * 100) / 100}%
                        </Text>
                        <Text style={{color:'white'}}>
                            Joy
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between',marginVertical:5}}>
                    <View style={{backgroundColor:'blue',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontWeight:'bold',fontSize:20}}>
                            {Math.round((item.analysis["emotion"]["sadness"]*100 + Number.EPSILON) * 100) / 100}%
                        </Text>
                        <Text style={{color:'white'}}>
                            Sadness
                        </Text>
                    </View>
                    <View style={{backgroundColor:'grey',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>
                            {Math.round((item.analysis["emotion"]["optimism"]*100 + Number.EPSILON) * 100) / 100}%
                        </Text>
                        <Text style={{color:'white'}}>
                            Optimism
                        </Text>
                    </View>
                </View>
            </View>
        );
    }


    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <Headline style={{textAlign:'center'}}>Detail of Tag {search} </Headline>
                <View style={{alignItems:'center'}}>
                    <Carousel
                        layout={"default"}
                        ref={c }
                        data={tweets}
                        renderItem={renderSlider}
                        sliderWidth={300}
                        itemWidth={300}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MarketerDetails;
