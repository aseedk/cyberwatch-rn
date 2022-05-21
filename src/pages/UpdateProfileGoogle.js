import * as React from 'react';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import styles from "../styles/global";
import {Button, Headline, HelperText, TextInput} from "react-native-paper";
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import RNSecureStore, {ACCESSIBLE} from "react-native-secure-store";
import CountryPicker, {
    getAllCountries,
} from 'react-native-country-picker-modal'
import {delay} from "../hooks/common";

const UpdateProfileGoogle = ({navigation}) =>{
    const [country, setCountry] = React.useState('Pakistan');
    const [countryCode, setCountryCode] = React.useState('PK');
    const [gender, setGender] = React.useState('male');
    const [dateOfBirth, setDateOfBirth] = React.useState('');
    const onChangeCountry = (country) =>{
        setCountry(country.name);
        setCountryCode(country.cca2);
    }
    const onChangeDateOfBirth = async () =>{
        DateTimePickerAndroid.open({
            value: new Date(),
            onChange: (event, selectedDate) => {
                if (event.type === 'set') {
                    let date = selectedDate.getDate() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getFullYear();
                    setDateOfBirth(date);
                } else if (event.type === 'dismissed') {
                    ToastAndroid.show('Date Picker Dismissed', ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show('Date Picker Error', ToastAndroid.SHORT);
                }
            },
            mode: 'date',
        });
        DateTimePickerAndroid.dismiss();
    }

    const handleUpdate = () =>{
        const user = auth().currentUser;

        firestore().collection('Users').doc(user.uid).update({
            dateOfBirth: dateOfBirth,
            country: country,
            gender: gender,
        }).then(async () => {
            const userDoc = await firestore().collection('Users').doc(user.uid).get();
            let tempUser = userDoc.data();
            tempUser.id = userDoc.id;
            RNSecureStore.set(
                'user',
                JSON.stringify(tempUser),
                ACCESSIBLE
            ).then(() => {
                navigation.navigate("LinkSocialMedia");
                ToastAndroid.show('User Profile Updated Successfully', ToastAndroid.SHORT);
            });
        }).catch(()=>{
            ToastAndroid.show('Error', ToastAndroid.SHORT);
        });
    }

    return(
        <SafeAreaView style={styles.mainView}>
            <ScrollView style={styles.bodyView}>
                <Headline style={{textAlign: 'center', fontWeight: 'bold', marginVertical: 20}}>
                    Update Profile Information
                </Headline>
                <TouchableOpacity onPress={onChangeDateOfBirth}>
                    <TextInput
                        label={"Date of Birth"}
                        placeholder={"Select Your Date of Birth"}
                        mode={"outlined"}
                        value={dateOfBirth}
                        editable={false}
                    />
                </TouchableOpacity>
                <HelperText type="error" visible={false}>
                    Date of Birth Error!
                </HelperText>
                <View style={{flexDirection:'row', alignItems:'center', backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 4, paddingVertical: 12, borderWidth: 1, justifyContent:'space-evenly'}}>
                    <Text>
                        Select Your Country:
                    </Text>
                    {country && <Text>{country}</Text>}
                    <CountryPicker
                        countryList={getAllCountries()}
                        translation="eng"
                        countryCode={countryCode}
                        onSelect={onChangeCountry}
                    />
                </View>

                <HelperText type="error" visible={false}>
                    Country Error!
                </HelperText>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
                    <Button
                        mode="contained"
                        icon={"gender-male"}
                        color={gender === 'male' && "teal" }
                        onPress={()=>{
                            setGender('male')
                        }}
                    >
                        Male
                    </Button>
                    <Button
                        mode="contained"
                        icon={"gender-male"}
                        color={gender === 'female' && "teal" }
                        onPress={()=>{
                            setGender('female')
                        }}
                    >
                        Female
                    </Button>
                    <Button
                        mode="contained"
                        icon={"gender-transgender"}
                        color={gender === 'others' && "teal" }
                        onPress={()=>{
                            setGender('others')
                        }}
                    >
                        Others
                    </Button>
                </View>
                <Button mode="contained" onPress={handleUpdate}>
                    Update Profile Information
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}
export default UpdateProfileGoogle;
