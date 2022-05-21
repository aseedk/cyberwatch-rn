import * as React from 'react';
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {Button, Headline, Subheading, TextInput} from "react-native-paper";
import axios from "axios";
import * as crypto from "crypto";
import RNSecureStore from "react-native-secure-store";
import styles from "../styles/global";
import { useTwitter } from "react-native-simple-twitter";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

let api_url = "http://192.168.100.8:5000/analyze"
const Marketer= ({navigation})=>{
    const { twitter, TWModal, loggedInUser, accessToken } = useTwitter({
        consumerKey: "4aNp2JGbx8eDXMvJzhjyWU8lf",
        consumerSecret: "QgJbqWNRMjGamwDLbvaim9z3HcZe4OVRjFDnHdwMMAXDhHci0l",
    })
    const [sentiment, setSentiment] = React.useState(0);
    const [sexism, setSexism] = React.useState(0);
    const [racism, setRacism] = React.useState(0);
    const [anger, setAnger] = React.useState(0);
    const [joy, setJoy] = React.useState(0);
    const [sadness, setSadness] = React.useState(0);
    const [optimism, setOptimism] = React.useState(0);
    const [search, setSearch] = React.useState("");
    const [user,setUser] = React.useState();
    const [tweets,setTweets] = React.useState([]);
    React.useEffect(() =>{
        const getUser = async () => {
            setUser(JSON.parse(await RNSecureStore.get("user")));
        }
        getUser().then(() => console.log("user"));
    }, []);
    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <View style={{flexDirection:"row"}}>
                    <TextInput
                        label="Search tags"
                        mode="outlined"
                        style={{flex:1}}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Button mode={"contained"} onPress={() => {
                        /*const oauth_timestamp = Math.floor(Date.now() / 1000);
                        const oauth_nonce = crypto.randomBytes(32).toString("hex");
                        const parameters = {
                            oauth_consumer_key: "4aNp2JGbx8eDXMvJzhjyWU8lf",
                            oauth_nonce: oauth_nonce,
                            oauth_signature_method: "HMAC-SHA1",
                            oauth_timestamp: oauth_timestamp,
                            oauth_token: user.twitterAccessToken,
                            oauth_version: "1.0",
                            q: search,
                            result_type: "popular",
                        };
                        let ordered = {};
                        Object.keys(parameters).sort().forEach(function(key) {
                            ordered[key] = parameters[key];
                        });
                        let encodedParameters = '';
                        for (let k in ordered) {
                            const encodedValue = escape(ordered[k]);
                            const encodedKey = encodeURIComponent(k);
                            if (encodedParameters === '') {
                                encodedParameters += encodeURIComponent(`${encodedKey}=${encodedValue}`)
                            } else {
                                encodedParameters += encodeURIComponent(`&${encodedKey}=${encodedValue}`);
                            }
                        }
                        console.log(encodedParameters);
                        const method = 'GET';
                        const base_url = 'https://api.twitter.com/1.1/search/tweets.json';
                        const encodedUrl = encodeURIComponent(base_url);
                        encodedParameters = encodeURIComponent(encodedParameters); // encodedParameters which we generated in last step.
                        const signature_base_string = `${method}&${encodedUrl}&${encodedParameters}`
                        console.log(signature_base_string)
                        const signing_key = encodeURIComponent("QgJbqWNRMjGamwDLbvaim9z3HcZe4OVRjFDnHdwMMAXDhHci0l") + "&" + encodeURIComponent(user.twitterAccessTokenSecret);
                        console.log("Signing Key: " + signing_key);
                        const oauth_signature = crypto.createHmac("sha1", signing_key).update(signature_base_string).digest().toString('base64');
                        console.log(oauth_signature);
                        const encoded_oauth_signature = encodeURIComponent(oauth_signature);
                        console.log(encoded_oauth_signature);*/
                        const oauth_timestamp = Math.floor(Date.now() / 1000);
                        const oauth_nonce = crypto.randomBytes(32).toString('hex');
                        const parameters={
                            oauth_consumer_key: "4aNp2JGbx8eDXMvJzhjyWU8lf",
                            oauth_nonce: oauth_nonce,
                            oauth_signature_method: "HMAC-SHA1",
                            oauth_timestamp: oauth_timestamp.toString(),
                            oauth_token: user.twitterAccessToken,
                            oauth_version: "1.0",
                            q: search,
                            result_type: "popular",
                        }
                        const encodedParameters = Object.keys(parameters).sort().map(key => {
                            return encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key]);
                        }).join("&");
                        console.log("Parameters: " + encodedParameters);
                        const url = "https://api.twitter.com/1.1/search/tweets.json";
                        const baseString = "GET&" + encodeURIComponent(url) + "&" + encodeURIComponent(encodedParameters);
                        console.log("Base String: " + baseString);
                        const signingKey = encodeURIComponent("QgJbqWNRMjGamwDLbvaim9z3HcZe4OVRjFDnHdwMMAXDhHci0l") + "&" + encodeURIComponent(user.twitterAccessTokenSecret);
                        console.log("Signing Key: " + signingKey);
                        const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
                        console.log("Signature: " + signature);
                        const encodedSignature = encodeURIComponent(signature);
                        const config = {
                            method: 'get',
                            url: `https://api.twitter.com/1.1/search/tweets.json?q=${search}&result_type=popular`,
                            headers: {
                                'Authorization': 'OAuth ' +
                                    'oauth_consumer_key="4aNp2JGbx8eDXMvJzhjyWU8lf",' +
                                    'oauth_token="2411881482-dHowB2NbXvejDe6xvxWJvzX5XGDIRyBEpFYJSKb",' +
                                    'oauth_signature_method="HMAC-SHA1",' +
                                    `oauth_timestamp="${oauth_timestamp}",` +
                                    `oauth_nonce="${oauth_nonce}",` +
                                    'oauth_version="1.0",' +
                                    `oauth_signature="${encodedSignature}"`
                            }
                        };

                        axios(config)
                            .then(async function (response) {
                                let data = response.data["statuses"];
                                let tweets = [];
                                for (let tweet of data) {
                                    let data = {
                                        "text": tweet.text,
                                    }
                                    await axios.post(api_url,
                                        {data},
                                        {headers: {'Content-Type': 'application/json',}}
                                    ).then(res =>{
                                        tweets.push({
                                            id: tweet.id_str,
                                            text: tweet.text,
                                            created_at: tweet.created_at,
                                            user:tweet.user.name,
                                            analysis: res.data
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                    });
                                }
                                setTweets(tweets);
                                let count = tweets.length;
                                let sentiment = 0;
                                let sexism = 0;
                                let racism = 0;
                                let joy = 0;
                                let anger = 0;
                                let optimism = 0;
                                let sadness = 0;
                                for (let tweet of tweets){
                                    let a = tweet["analysis"]
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

                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                    }}>
                        <Text>Search</Text>
                    </Button>
                </View>
                <Headline style={{textAlign:'center'}}>Summary of tag {search} </Headline>
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
                </View>
                <SafeAreaView style={{marginVertical:40}}>
                    <Button mode={'contained'} onPress={()=> navigation.navigate("Marketer Details",{
                        tweets: tweets,
                        search: search,
                    })}>
                        <Text>Show more details</Text>
                    </Button>
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Marketer
