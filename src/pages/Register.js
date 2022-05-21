import * as React from 'react';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import styles from "../styles/global";
import {Button, Headline, HelperText, TextInput} from "react-native-paper";
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import RNSecureStore, {ACCESSIBLE} from "react-native-secure-store";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker, {
    getAllCountries,
} from 'react-native-country-picker-modal'
import {delay} from "../hooks/common";
import {validateEmail, validateName, validatePassword} from "../hooks/syntax";

const Register = ({navigation}) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [country, setCountry] = React.useState('Pakistan');
    const [countryCode, setCountryCode] = React.useState('PK');
    const [gender, setGender] = React.useState('male');
    const [dateOfBirth, setDateOfBirth] = React.useState('');
    const [nameError, setNameError] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const [eye, setEye] = React.useState(true);

    const onChangeName = async (name) => {
        setName(name);
        await delay(1000);
        if (name === "") {
            setNameError(false);
        } else if (!validateName(name)) {
            setNameError(true);
        } else {
            setNameError(false);
        }
    };
    const onChangeEmail = async (email) => {
        setEmail(email);
        await delay(1000);
        if (email === ""){
            setEmailError(false);
        }else if(!validateEmail(email)){
            setEmailError(true);
        }else {
            setEmailError(false)
        }
    }
    const onChangePassword = async (password) =>{
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
        })
        DateTimePickerAndroid.dismiss();
    }

    const handleRegister = () => {
        if (
            name !== "" &&
            email !== "" &&
            password !== "" &&
            country !== "" &&
            dateOfBirth !== "" &&
            gender !== "" &&
            !nameError &&
            !emailError &&
            !passwordError
        ) {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    firestore()
                        .collection('Users')
                        .doc(user.user.uid)
                        .set({
                            name: name,
                            email: email,
                            country: country,
                            dateOfBirth: dateOfBirth,
                            gender: gender,
                        })
                        .then(async () => {
                            const userDoc = await firestore().collection('Users').doc(user.user.uid).get();
                            let tempUser = userDoc.data();
                            tempUser.id = userDoc.id;
                            RNSecureStore.set(
                                'user',
                                JSON.stringify(tempUser),
                                ACCESSIBLE
                            ).then(() => {
                                navigation.navigate("LinkSocialMedia");
                                ToastAndroid.show('User Registered Successfully', ToastAndroid.SHORT);
                            });
                        });
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        ToastAndroid.show('That email address is already in use!', ToastAndroid.SHORT);
                    }
                    if (error.code === 'auth/invalid-email') {
                        ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
                    }
                    if (error.code === 'auth/operation-not-allowed') {
                        ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
                    }
                    if (error.code === 'auth/weak-password') {
                        ToastAndroid.show('auth/weak-password', ToastAndroid.SHORT);
                    }
                    ToastAndroid.show(error);
                });
        }else {
            ToastAndroid.show("Fix Registration Form", ToastAndroid.LONG)
        }
    }
  return (
      <SafeAreaView style={styles.mainView}>
          <ScrollView style={styles.bodyView}>
              <Headline style={{textAlign: 'center', fontWeight: 'bold', marginVertical: 20}}>Register your account</Headline>
              <TextInput
                  label="Full Name"
                  placeholder={"Enter your Name"}
                  mode={'outlined'}
                  value={name}
                  error={nameError}
                  onChangeText={onChangeName}
              />
              <HelperText type="error" visible={nameError}>
                  Name Entered is not valid
              </HelperText>
              <TextInput
                  label="Email Address"
                  placeholder={"Enter Your Email Address"}
                  mode={'outlined'}
                  value={email}
                  error={emailError}
                  onChangeText={onChangeEmail}
              />
              <HelperText type="error" visible={emailError}>
                  Email Address is invalid
              </HelperText>
              <TextInput
                  label={"Password"}
                  placeholder={"Enter Your Password"}
                  mode={"outlined"}
                  value={password}
                  error={passwordError}
                  onChangeText={onChangePassword}
                  secureTextEntry={eye}
                  right={<TextInput.Icon name="eye"  onPress={()=>{setEye(!eye)}}/>}
              />
              <HelperText type="error" visible={passwordError}>
                  Password must contain at least 8 letters and 1 digit!
              </HelperText>
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
              <View style={{flexDirection:'row', justifyContent:'space-evenly', marginBottom:20}}>
                  <Button
                      mode="contained"
                      color={gender === 'male' && "teal" }
                      onPress={()=>{
                          setGender('male')
                      }}
                  >
                      <Icon name="gender-male" size={30} color="#900" />
                  </Button>
                  <Button
                      mode="contained"
                      color={gender === 'female' && "teal" }
                      onPress={()=>{
                          setGender('female')
                      }}
                  >
                      <Icon name="gender-female" size={30} color="#900" />
                  </Button>
                  <Button
                      mode="contained"
                      color={gender === 'others' && "teal" }
                      onPress={()=>{
                          setGender('others')
                      }}
                  >
                      <Icon name={"gender-transgender"} size={30} color="#900" />
                  </Button>
              </View>
              <Button mode="contained" onPress={handleRegister}>
                  Register
              </Button>
              <TouchableOpacity style={{flexDirection:'row', marginVertical:40, justifyContent:'center', marginBottom:20}}
                                onPress={()=> navigation.navigate('Login')}>
                  <Text>Already have an account? </Text>
                  <Text style={{color:'tomato'}}>Sign In</Text>
              </TouchableOpacity>
          </ScrollView>
      </SafeAreaView>
  );
};
export default Register;
