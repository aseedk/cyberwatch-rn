import * as React from 'react';
import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {Button, Headline, Subheading} from "react-native-paper";
import axios from "axios";
import RNSecureStore from "react-native-secure-store";
import styles from "../styles/global";
import { useTwitter } from "react-native-simple-twitter";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

let url = "http://192.168.18.44:5000/analyze"
const Dashboard = ({navigation}) => {
    const [threats, setThreats] = React.useState([]);
    const [date, setDate] = React.useState();
    const [sentiment, setSentiment] = React.useState(0);
    const [sexism, setSexism] = React.useState(0);
    const [racism, setRacism] = React.useState(0);
    const [anger, setAnger] = React.useState(0);
    const [joy, setJoy] = React.useState(0);
    const [sadness, setSadness] = React.useState(0);
    const [optimism, setOptimism] = React.useState(0);
    const [user, setUser] = React.useState({});
    const { twitter, TWModal, loggedInUser, accessToken } = useTwitter({
        consumerKey: "4aNp2JGbx8eDXMvJzhjyWU8lf",
        consumerSecret: "QgJbqWNRMjGamwDLbvaim9z3HcZe4OVRjFDnHdwMMAXDhHci0l",
    })
    React.useEffect(() =>{
        const getUser = async () => {
            setUser(JSON.parse(await RNSecureStore.get("user")));
        }
        getUser().then(() => console.log("user"));
    }, []);
    React.useEffect(()=>{

        firestore().collection("Analysis")
            .doc(auth().currentUser.uid).get()
            .then(doc => {
                let now = new Date();
                now = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                setDate(now.toISOString().split("T")[0])
                if (doc.exists){
                    let posts = []
                    let photos = []
                    let videos = []
                    let tweets = []
                    let retweets = []
                    for (let facebookPost of doc.data().facebookPosts){
                        let postDate = facebookPost["created_at"].split("T")[0]
                        postDate = postDate.split("-")
                        postDate = new Date(Number(postDate[0]), Number(postDate[1]) -1, Number(postDate[2]))
                        if (postDate > now){
                            posts.push(facebookPost)
                        }
                    }
                    for (let facebookPhoto of doc.data().facebookPhotos){
                        let photoDate = facebookPhoto["created_at"].split("T")[0]
                        photoDate = photoDate.split("-")
                        photoDate = new Date(Number(photoDate[0]), Number(photoDate[1]) -1, Number(photoDate[2]))
                        if (photoDate > now){
                            photos.push(facebookPhoto)
                        }
                    }
                    for (let facebookVideo of doc.data().facebookVideos){
                        let videoDate = facebookVideo["created_at"].split("T")[0]
                        videoDate = videoDate.split("-")
                        videoDate = new Date(Number(videoDate[0]), Number(videoDate[1]) -1, Number(videoDate[2]))
                        if (videoDate > now){
                            videos.push(facebookVideo)
                        }
                    }
                    for (let twitterTweet of doc.data().twitterTweets){
                        let tweetDate = twitterTweet.created_at;
                        tweetDate = new Date(tweetDate).toISOString().split('T')[0];
                        tweetDate = tweetDate.split("-")
                        tweetDate = new Date(Number(tweetDate[0]), Number(tweetDate[1]) -1, Number(tweetDate[2]))
                        if (tweetDate > now){
                            tweets.push(twitterTweet)
                        }
                    }
                    for (let twitterRetweet of doc.data().twitterRetweets){
                        let retweetDate = twitterRetweet.created_at;
                        retweetDate = new Date(retweetDate).toISOString().split('T')[0];
                        retweetDate = retweetDate.split("-")
                        retweetDate = new Date(Number(retweetDate[0]), Number(retweetDate[1]) -1, Number(retweetDate[2]))
                        if (retweetDate > now){
                            retweets.push(twitterRetweet)
                        }
                    }
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
                        if (
                            a["sentiment"] === "Negative" ||
                            a["sexism"] === "Positive" ||
                            a["racism"] === "Positive"
                        ){

                            if (threats.length === 0){
                                threats.push({name: user.name, count: 1})
                            }else {
                                let check = false
                                let index ;
                                for (let i=0; i< threats.length; i++){
                                    if (threats[i].name === user.name){
                                        check = true;
                                        index = i
                                        break;
                                    }
                                }
                                if (!check){
                                    threats.push({name: user.name, count: 1})
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
                    for (let video of videos){
                        let a = video["analysis"]
                        if (
                            a["sentiment"] === "Negative" ||
                            a["sexism"] === "Positive" ||
                            a["racism"] === "Positive"
                        ){

                            if (threats.length === 0){
                                threats.push({name: user.name, count: 1})
                            }else {
                                let check = false
                                let index ;
                                for (let i=0; i< threats.length; i++){
                                    if (threats[i].name === user.name){
                                        check = true;
                                        index = i
                                        break;
                                    }
                                }
                                if (!check){
                                    threats.push({name: user.name, count: 1})
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
                    for (let post of posts){
                        let a = post["analysis"]
                        if (
                            a["sentiment"] === "Negative" ||
                            a["sexism"] === "Positive" ||
                            a["racism"] === "Positive"
                        ){

                            if (threats.length === 0){
                                threats.push({name: user.name, count: 1})
                            }else {
                                let check = false
                                let index ;
                                for (let i=0; i< threats.length; i++){
                                    if (threats[i].name === user.name){
                                        check = true;
                                        index = i
                                        break;
                                    }
                                }
                                if (!check){
                                    threats.push({name: user.name, count: 1})
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
    }, [])
    const analyseFacebookData = () => {
        console.log("analyse facebook data");
        let FacebookPostsIDs = [];
        let FacebookPhotosIDs = [];
        let FacebookVideosIDs = [];
        firestore().collection("Analysis").doc(auth().currentUser.uid).get().then(doc => {
            if(doc.exists){
                for (let facebookPost of doc.data().facebookPosts){
                    FacebookPostsIDs.push(facebookPost.id);
                }
                for (let facebookPhoto of doc.data().facebookPhotos){
                    FacebookPhotosIDs.push(facebookPhoto.id);
                }
                for (let facebookVideo of doc.data().facebookVideos){
                    FacebookVideosIDs.push(facebookVideo.id);
                }
            }
        });
        axios.get("https://graph.facebook.com/v13.0/me?fields=posts&access_token=" + user.facebookAccessToken)
            .then(async res => {
                let posts = res.data.posts.data;
                let tempPosts = [];
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i];
                    if (post.message && post.message.length > 0 && !FacebookPostsIDs.includes(post.id)) {
                        let data = {
                            "text": post.message,
                        }
                        await axios.post(url,
                            {data},
                            {headers: {'Content-Type': 'application/json',}}
                        )
                            .then(res => {
                                tempPosts.push({
                                    id: post.id,
                                    text: post.message,
                                    created_at: post.created_time,
                                    analysis: res.data
                                });
                            })
                            .catch(err => {
                                console.log("err", err);
                            });
                    }
                }
                firestore().collection("Analysis").doc(auth().currentUser.uid).update({
                    facebookPosts: firestore.FieldValue.arrayUnion(...tempPosts)
                }).then(() => {
                    console.log("updated");
                }).catch(err => {
                    if (err.code === "firestore/not-found") {
                        firestore().collection("Analysis").doc(auth().currentUser.uid).set({
                            facebookPosts: tempPosts
                        }).then(() => {
                            console.log("updated");
                        }).catch(err => {
                            console.log("err", err);
                        });
                    }
                });
            })
            .catch(err => {
                console.log("err", err);
            })
        axios.get("https://graph.facebook.com/v13.0/me?fields=photos&access_token=" + user.facebookAccessToken)
            .then(async res => {
               let photos =  res.data.photos.data;
                let tempPhotos = [];
                for (let i = 0; i < photos.length; i++) {
                    let photo = photos[i];
                    if (photo.name && photo.name.length > 0 && !FacebookPhotosIDs.includes(photo.id)) {
                        let data = {
                            "text": photo.name,
                        }
                        await axios.post(url,
                            {data},
                            {headers: {'Content-Type': 'application/json',}}
                        )
                            .then(res => {
                                tempPhotos.push({
                                    id: photo.id,
                                    text: photo.name,
                                    created_at: photo.created_time,
                                    analysis: res.data
                                });
                            })
                            .catch(err => {
                                console.log("err", err);
                            });
                    }
                }
                firestore().collection("Analysis").doc(auth().currentUser.uid).update({
                    facebookPhotos: firestore.FieldValue.arrayUnion(...tempPhotos)
                }).then(() => {
                    console.log("updated");
                }).catch(err => {
                    if (err.code === "firestore/not-found") {
                        firestore().collection("Analysis").doc(auth().currentUser.uid).set({
                            facebookPhotos: tempPhotos
                        }).then(() => {
                            console.log("updated");
                        }).catch(err => {
                            console.log("err", err);
                        });
                    }
                });
            })
            .catch(err => {
                console.log("err", err);
            })
        axios.get("https://graph.facebook.com/v13.0/me?fields=videos&access_token=" + user.facebookAccessToken)
            .then(async res => {
                let videos = res.data.videos.data;
                let tempVideos = [];
                for (let i = 0; i < videos.length; i++) {
                    let video = videos[i];
                    if (video.message && video.message.length > 0 && !FacebookVideosIDs.includes(video.id)) {
                        let data = {
                            "text": video.message,
                        }
                        await axios.post(url,
                            {data},
                            {headers: {'Content-Type': 'application/json',}}
                        )
                            .then(res => {
                                tempVideos.push({
                                    id: video.id,
                                    text: video.message,
                                    created_at: video.created_time,
                                    analysis: res.data
                                });
                            })
                            .catch(err => {
                                console.log("err", err);
                            });
                    }
                }
                firestore().collection("Analysis").doc(auth().currentUser.uid).update({
                    facebookVideos: firestore.FieldValue.arrayUnion(...tempVideos)
                }).then(() => {
                    console.log("updated");
                }).catch(err => {
                    if (err.code === "firestore/not-found") {
                        firestore().collection("Analysis").doc(auth().currentUser.uid).set({
                            facebookVideos: tempVideos
                        }).then(() => {
                            console.log("updated");
                        }).catch(err => {
                            console.log("err", err);
                        });
                    }
                });
            })
            .catch(err => {
                console.log("err", err);
            })
    }
    const analyseTwitterData = async () => {
        let twitterTweetsIDs = [];
        let twitterRetweetsIDs = [];
        firestore().collection("Analysis").doc(auth().currentUser.uid).get().then(doc => {
            if(doc.exists){
                for (let twitterTweet of doc.data().twitterTweets){
                    twitterTweetsIDs.push(twitterTweet.id);
                }
                for (let twitterRetweet of doc.data().twitterRetweets){
                    twitterRetweetsIDs.push(twitterRetweet.id);
                }
            }
        });
        twitter.setConsumerKey("4aNp2JGbx8eDXMvJzhjyWU8lf","QgJbqWNRMjGamwDLbvaim9z3HcZe4OVRjFDnHdwMMAXDhHci0l");
        twitter.setAccessToken(user.twitterAccessToken, user.twitterAccessTokenSecret);
        const userTimeline = await twitter.api('GET', 'statuses/user_timeline.json', {count: 10});
        let tweets = [];
        for  (let i = 0; i < userTimeline.length; i++) {
            const tweet = userTimeline[i];
            if (tweet.text && tweet.text.length > 0 && !twitterTweetsIDs.includes(tweet.id_str)) {
                let data = {
                    "text": tweet.text,
                }
                await axios.post(url,
                    {data},
                    {headers: {'Content-Type': 'application/json',}}
                )
                    .then(res => {
                        tweets.push({
                            id: tweet.id_str,
                            text: tweet.text,
                            created_at: tweet.created_at,
                            user:tweet.user.name,
                            analysis: res.data
                        });
                    })
                    .catch(err => {
                        console.log("err", err);
                    });
            }
        }
        firestore().collection("Analysis").doc(auth().currentUser.uid).update({
            twitterTweets: firestore.FieldValue.arrayUnion(...tweets)
        }).then(() => {
            console.log("updated");
        }).catch(err => {
            if (err.code === "firestore/not-found") {
                firestore().collection("Analysis").doc(auth().currentUser.uid).set({
                    twitterTweets: tweets
                }).then(() => {
                    console.log("updated");
                }).catch(err => {
                    console.log("err", err);
                });
            }
        });
        let retweets = [];
        const mentionTimeline = await twitter.api('GET', 'statuses/mentions_timeline.json', {count: 10});
        for  (let i = 0; i < mentionTimeline.length; i++) {
            const retweet = mentionTimeline[i]
            if (retweet.text && retweet.text.length > 0 && !twitterRetweetsIDs.includes(retweet.id_str)) {
                let data = {
                    "text": retweet.text,
                }
                await axios.post(url,
                    {data},
                    {headers: {'Content-Type': 'application/json',}}
                )
                    .then(res => {
                        retweets.push({
                            id: retweet.id_str,
                            text: retweet.text,
                            created_at: retweet.created_at,
                            user:retweet.user.name,
                            analysis: res.data
                        });
                    })
                    .catch(err => {
                        console.log("err", err);
                    })
            }
        }
        firestore().collection("Analysis").doc(auth().currentUser.uid).update({
            twitterRetweets: firestore.FieldValue.arrayUnion(...retweets)
        }).then(() => {
            console.log("updated");
        }).catch(err => {
            if (err.code === "firestore/not-found") {
                firestore().collection("Analysis").doc(auth().currentUser.uid).set({
                    twitterRetweets: retweets
                }).then(() => {
                    console.log("updated");
                }).catch(err => {
                    console.log("err", err);
                });
            }
        });
    }
    const generateDailyReport = async () =>{
        let today = new Date();
        today = today.toISOString().split('T')[0];
        let id;
        await firestore().collection("Report")
            .where("date", '==', today)
            .where("reportOf", '==', auth().currentUser.uid)
            .get()
            .then(doc => {


            if (!doc.empty) {
                id = doc.docs[0].id;
            }
        })
        let todayPosts = [];
        let todayPhotos = [];
        let todayVideos = [];
        let todayTweets = [];
        let todayRetweets = [];

        await firestore().collection("Analysis").doc(auth().currentUser.uid).get().then(doc => {
            if(doc.exists){
                for (let facebookPost of doc.data().facebookPosts){
                    let date = facebookPost.created_at.split("T")[0];
                    if (date === today){
                        todayPosts.push(facebookPost);
                    }
                }
                for (let facebookPhoto of doc.data().facebookPhotos){
                    let date = facebookPhoto.created_at.split("T")[0];
                    if (date === today){

                        todayPhotos.push(facebookPhoto);
                    }
                }
                for (let facebookVideo of doc.data().facebookVideos){
                    let date = facebookVideo.created_at.split("T")[0];
                    if (date === today){
                        todayVideos.push(facebookVideo);
                    }
                }
                for (let twitterTweet of doc.data().twitterTweets){
                    let date = twitterTweet.created_at;
                    date = new Date(date).toISOString().split('T')[0];
                    if (date === today){
                        todayTweets.push(twitterTweet);
                    }
                }
                for (let twitterRetweet of doc.data().twitterRetweets){
                    let date = twitterRetweet.created_at;
                    date = new Date(date).toISOString().split('T')[0];
                    if (date === today){
                        todayRetweets.push(twitterRetweet);
                    }
                }

            }
        });
        firestore().collection("Report").doc(id).update({
            posts: todayPosts,
            photos: todayPhotos,
            videos: todayVideos,
            tweets: todayTweets,
            retweets: todayRetweets
        }).then(() => {
            console.log("updated");
        }).catch(err => {
            if (err.code === "firestore/not-found") {
                firestore().collection("Report").doc().set({
                    date: today,
                    reportOf: auth().currentUser.uid,
                    posts: todayPosts,
                    photos: todayPhotos,
                    videos: todayVideos,
                    tweets: todayTweets,
                    retweets: todayRetweets
                }).then(() => {
                    console.log("updated");
                }).catch(err => {
                    console.log("err", err);
                });
            }
        });
    }
    const getSocialMediaAnalysis = () =>{
        analyseFacebookData();
        analyseTwitterData();
        generateDailyReport();
    }


    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <Button
                    mode="contained"
                    onPress={getSocialMediaAnalysis}
                >
                    Perform Analysis on Social Media
                </Button>
                <Headline style={{textAlign:'center'}}>This week report of {user.name} </Headline>
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
                        <Button mode={'contained'} onPress={()=> navigation.navigate("Dashboard Details")}>
                            <Text>Show more details</Text>
                        </Button>
                    </SafeAreaView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Dashboard;
