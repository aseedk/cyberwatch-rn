import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './pages/Login';
import Register from "./pages/Register";
import UpdateProfileGoogle from "./pages/UpdateProfileGoogle";
import ForgotPassword from "./pages/ForgotPassword";
import LinkSocialMedia from "./pages/LinkSocialMedia";
import Dashboard from "./pages/Dashboard";
import {Text, View} from "react-native";
import DashboardTabNavigator from "./DashboardTabNavigator";
import ReportAddFriends from "./pages/Report/ReportAddFriends";
import Report from "./pages/Report/Report";
import ReportDetails from "./pages/Report/ReportDetails";
import DashboardDetails from "./pages/DashboardDetails";
import MarketerDetails from "./pages/MarketerDetails";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Main() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="UpdateProfileGoogle" component={UpdateProfileGoogle} />
                <Stack.Screen name={"ForgotPassword"} component={ForgotPassword} />
                <Stack.Screen name={"LinkSocialMedia"} component={LinkSocialMedia} />
                <Stack.Screen name={'Dashboard'} component={DashboardTabNavigator} />
                <Stack.Screen name={'Dashboard Details'} component={DashboardDetails} />
                <Stack.Screen name={'Report Add Friends'} component={ReportAddFriends} />
                <Stack.Screen name={'Report Today'} component={Report} />
                <Stack.Screen name={'Report Details'} component={ReportDetails}/>
                <Stack.Screen name={'Marketer Details'} component={MarketerDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default Main;
