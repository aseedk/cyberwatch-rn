import * as React from 'react';
import styles from "../../styles/global";
import {SafeAreaView, ScrollView, Text, View, ToastAndroid, TouchableOpacity, Image} from "react-native";
import {Avatar, Button, Headline, Subheading, TextInput} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const Report = ({route, navigation}) =>{
    let {id, name} = route.params;
    const [threats, setThreats] = React.useState([]);
    const [date, setDate] = React.useState();
    const [sentiment, setSentiment] = React.useState(0);
    const [sexism, setSexism] = React.useState(0);
    const [racism, setRacism] = React.useState(0);
    const [anger, setAnger] = React.useState(0);
    const [joy, setJoy] = React.useState(0);
    const [sadness, setSadness] = React.useState(0);
    const [optimism, setOptimism] = React.useState(0);
    React.useEffect( () => {
        console.log("Start")
        let today = new Date();
        today = today.toISOString().split('T')[0];
        firestore().collection("Report")
            .where("date", '==', today)
            .where("reportOf", '==', id)
            .get()
            .then(doc => {
                if (!doc.empty) {
                    setDate(today)
                    let photos = doc.docs[0].get("photos")
                    let videos = doc.docs[0].get("videos")
                    let posts = doc.docs[0].get("posts")
                    let tweets = doc.docs[0].get("tweets")
                    let retweets = doc.docs[0].get("retweets")
                    let count = photos.length + videos.length + posts.length + tweets.length + retweets.length
                    let sentiment = 0;
                    let sexism = 0;
                    let racism = 0;
                    let joy = 0;
                    let anger = 0;
                    let optimism = 0;
                    let sadness = 0;
                    let threats = [];
                    for (let photo of photos){
                        let a = photo["analysis"]
                        if (a["sentiment"] === "Positive"){
                            sentiment++
                        }
                        if (a["sexism"] === "Positive"){
                            sexism++
                        }
                        if (a["racism"] === "Positive"){
                            racism++
                        }
                        let emotion = a["emotion"]
                        anger += emotion["anger"]
                        joy += emotion["joy"]
                        optimism += emotion["optimism"]
                        sadness += emotion["sadness"]

                    }
                    for (let video of videos){
                        let a = video["analysis"]
                        if (a["sentiment"] === "Positive"){
                            sentiment++
                        }
                        if (a["sexism"] === "Positive"){
                            sexism++
                        }
                        if (a["racism"] === "Positive"){
                            racism++
                        }
                        let emotion = a["emotion"]
                        anger += emotion["anger"]
                        joy += emotion["joy"]
                        optimism += emotion["optimism"]
                        sadness += emotion["sadness"]
                    }
                    for (let post of posts){
                        let a = post["analysis"]
                        if (a["sentiment"] === "Positive"){
                            sentiment++
                        }
                        if (a["sexism"] === "Positive"){
                            sexism++
                        }
                        if (a["racism"] === "Positive"){
                            racism++
                        }
                        let emotion = a["emotion"]
                        anger += emotion["anger"]
                        joy += emotion["joy"]
                        optimism += emotion["optimism"]
                        sadness += emotion["sadness"]
                    }
                    for (let tweet of tweets){
                        let a = tweet["analysis"]
                        if (
                            a["sentiment"] === "Negative" ||
                            a["sexism"] === "Positive" ||
                            a["racism"] === "Positive"
                        ){


                            if (threats.length === 0){
                                threats.push({name: tweet["user"], count: 1})
                            }else {
                                let check = false
                                let index ;
                                for (let i=0; i< threats.length; i++){
                                    if (threats[i].name === tweet["user"]){
                                        check = true;
                                        index = i
                                        break;
                                    }
                                }
                                if (!check){
                                    threats.push({name: tweet["user"], count: 1})
                                }else {
                                    threats[index].count += 1;
                                }
                            }
                        }
                        if (a["sentiment"] === "Positive"){
                            sentiment++
                        }
                        if (a["sexism"] === "Positive"){
                            sexism++
                        }
                        if (a["racism"] === "Positive"){
                            racism++
                        }
                        let emotion = a["emotion"]
                        anger += emotion["anger"]
                        joy += emotion["joy"]
                        optimism += emotion["optimism"]
                        sadness += emotion["sadness"]
                    }
                    for (let retweet of retweets){
                        let a = retweet["analysis"]
                        if (
                            a["sentiment"] === "Negative" ||
                            a["sexism"] === "Positive" ||
                            a["racism"] === "Positive"
                        ){

                            if (threats.length === 0){
                                threats.push({name: retweet["user"], count: 1})
                            }else {
                                let check = false
                                let index ;
                                for (let i=0; i< threats.length; i++){
                                    if (threats[i].name === retweet["user"]){
                                        check = true;
                                        index = i
                                        break;
                                    }
                                }
                                if (!check){
                                    threats.push({name: retweet["user"], count: 1})
                                }else {
                                    threats[index].count += 1;
                                }
                            }
                        }
                        if (a["sentiment"] === "Positive"){
                            sentiment++
                        }
                        if (a["sexism"] === "Positive"){
                            sexism++
                        }
                        if (a["racism"] === "Positive"){
                            racism++
                        }
                        let emotion = a["emotion"]
                        anger += emotion["anger"]
                        joy += emotion["joy"]
                        optimism += emotion["optimism"]
                        sadness += emotion["sadness"]
                    }
                    sentiment = sentiment/count * 100
                    racism = racism/count * 100
                    sexism = sexism/count * 100
                    anger = anger/count * 100
                    joy = joy/count * 100
                    sadness = sadness/count * 100
                    optimism = optimism/count * 100
                    setSentiment(Math.round((sentiment + Number.EPSILON) * 100) / 100)
                    setRacism(Math.round((racism + Number.EPSILON) * 100) / 100)
                    setSexism(Math.round((sexism + Number.EPSILON) * 100) / 100)
                    setAnger(Math.round((anger + Number.EPSILON) * 100) / 100)
                    setJoy(Math.round((joy + Number.EPSILON) * 100) / 100)
                    setSadness(Math.round((sadness + Number.EPSILON) * 100) / 100)
                    setOptimism(Math.round((optimism + Number.EPSILON) * 100) / 100)
                    console.log(threats)
                    setThreats(threats)
                }
            })
    }, []);
    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={[styles.bodyView,{contentContainerStyle: "center"}]}>
                <Headline style={{textAlign:'center'}}>Today's Report of {name} </Headline>
                <Subheading style={{textAlign:'center'}}>Date: {date}</Subheading>
                <View style={{marginTop:40, alignItems: 'center'}}>
                    <View style={[{paddingVertical:16, paddingHorizontal: 16,marginVertical:10, borderRadius:25, justifyContent:'space-between', flexDirection:'row', width: 300, height:70}, sentiment>50? {backgroundColor: "green"}: {backgroundColor: "red"}]}>
                        <Text style={{color:'white', fontSize:24}}>
                            Sentiment:
                        </Text>
                        <Text style={{fontWeight:"bold", color:"white", fontSize:26}}>{sentiment}%</Text>
                    </View>
                    <View style={[{paddingVertical:16, paddingHorizontal: 16,marginVertical:10, borderRadius:25, backgroundColor: "red", justifyContent:'space-between', flexDirection:'row', width: 300, height:70}, sexism<50? {backgroundColor: "green"}: {backgroundColor: "red"}]}>
                        <Text style={{color:'white', fontSize:24}}>
                            Sexism:
                        </Text>
                        <Text style={{fontWeight:"bold", color:"white", fontSize:26}}>{sexism}%</Text>
                    </View>
                    <View style={[{paddingVertical:16, paddingHorizontal: 16,marginVertical:10, borderRadius:25, backgroundColor: "red", justifyContent:'space-between', flexDirection:'row', width: 300, height:70}, racism<50? {backgroundColor: "green"}: {backgroundColor: "red"}]}>
                        <Text style={{color:'white', fontSize:24}}>
                            Racism:
                        </Text>
                        <Text style={{fontWeight:"bold", color:"white", fontSize:26}}>{racism}%</Text>
                    </View>
                    <Text style={{fontWeight:'bold', fontSize: 26}}>Emotion</Text>
                    <View style={{marginVertical:5}}>
                        <View style={{flexDirection:'row', justifyContent:'center',marginVertical:5}}>
                            <View style={{backgroundColor:'red',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontWeight:'bold',fontSize:20}}>
                                    {anger}%
                                </Text>
                                <Text style={{color:'white'}}>
                                    Anger
                                </Text>
                            </View>
                            <View style={{backgroundColor:'orange',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>
                                    {joy}%
                                </Text>
                                <Text style={{color:'white'}}>
                                    Joy
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between',marginVertical:5}}>
                            <View style={{backgroundColor:'blue',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontWeight:'bold',fontSize:20}}>
                                    {sadness}%
                                </Text>
                                <Text style={{color:'white'}}>
                                    Sadness
                                </Text>
                            </View>
                            <View style={{backgroundColor:'grey',marginHorizontal:20, height:100, width:100, borderRadius:25, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>
                                    {optimism}%
                                </Text>
                                <Text style={{color:'white'}}>
                                    Optimism
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontWeight:'bold', fontSize: 26}}>Threat List</Text>
                    <View style={{backgroundColor:'black',borderRadius:15, width:'90%', paddingVertical: 8, paddingHorizontal: 4, marginVertical:5}}>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            borderBottomWidth:1,
                            borderBottomColor:'red',
                            paddingVertical:4,
                            paddingHorizontal: 2

                        }}>
                            <Text style={{color:'white', fontWeight:"bold", fontSize:18}}>
                                Name
                            </Text>
                            <Text style={{color:'white', fontWeight:"bold", fontSize:18}}>
                                Messages
                            </Text>
                        </View>
                        {threats.map((val, ind)=>{
                            return (
                                <View key={ind} style={{
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    paddingVertical:4,
                                    paddingHorizontal:2,
                                    borderBottomWidth:1,
                                    borderBottomColor:'red',

                                }}>
                                    <Text style={{color:'white', fontWeight:"500", fontSize:16}}>
                                        {val.name}
                                    </Text>
                                    <Text style={{color:'red', fontWeight:"500", fontSize:16}}>
                                        {val.count}
                                    </Text>
                                </View>
                            )
                        })}

                    </View>
                    <SafeAreaView style={{marginVertical:40}}>
                        <Button mode={'contained'} onPress={()=> navigation.navigate("Report Details", {
                            id: id,
                            name: name
                        })}>
                            <Text>Show more details</Text>
                        </Button>
                    </SafeAreaView>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Report;
