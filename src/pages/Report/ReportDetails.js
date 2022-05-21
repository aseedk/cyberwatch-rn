import * as React from 'react';
import styles from "../../styles/global";
import {SafeAreaView, ScrollView, Text, View, ToastAndroid, TouchableOpacity, Image} from "react-native";
import {Avatar, Button, Headline, Subheading, TextInput} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Carousel from 'react-native-snap-carousel';
import {useRef} from "react";
import RNSecureStore from "react-native-secure-store";

const ReportDetails = ({route}) =>{
    let {id, name} = route.params;
    const [activities, setActivities] = React.useState([]);
    const [user,setUser] = React.useState([]);
    const [date,setDate] = React.useState();
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
                    Sender: {item.user? item.user: user.name}
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
    React.useEffect( () => {
        let today = new Date();
        today = today.toISOString().split('T')[0];
        setDate(today)
        firestore().collection("Report")
            .where("date", '==', today)
            .where("reportOf", '==', id)
            .get()
            .then(doc => {
                let photos = doc.docs[0].get("photos")
                let videos = doc.docs[0].get("videos")
                let posts = doc.docs[0].get("posts")
                let tweets = doc.docs[0].get("tweets")
                let retweets = doc.docs[0].get("retweets")
                let activities = []
                for (let photo of photos){
                    activities.push(photo)
                }
                for (let video of videos){
                    activities.push(video)
                }
                for (let post of posts){
                    activities.push(posts)
                }
                for (let tweet of tweets){
                    activities.push(tweet)
                }
                for (let retweet of retweets){
                    activities.push(retweet)
                }
                setActivities(activities);
            })
    }, [])
    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <Headline style={{textAlign:'center'}}>Today's Report of {name} </Headline>
                <Subheading style={{textAlign:'center'}}>Date: {date}</Subheading>
                <View style={{alignItems:'center'}}>
                    <Carousel
                        layout={"default"}
                        ref={c }
                        data={activities}
                        renderItem={renderSlider}
                        sliderWidth={300}
                        itemWidth={300}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ReportDetails;
