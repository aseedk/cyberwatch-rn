import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "react-native-vector-icons/Ionicons";
import Dashboard from "./pages/Dashboard";
import ReportHomePage from "./pages/Report/ReportHomePage";
import Marketer from "./pages/Marketer";
import Chatbot from "./pages/Chatbot";

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function DashboardTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route , headerShown}) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'ios-information-circle'
                            : 'ios-information-circle-outline';
                    } else if (route.name === 'Report') {
                        iconName = focused ? 'alert' : 'alert';
                    }else if (route.name === 'Marketer') {
                        iconName = focused ? 'search' : 'search';
                    }else if (route.name === 'Chatbot') {
                        iconName = focused ? 'chat' : 'chat';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Dashboard} />
            <Tab.Screen name="Report" component={ReportHomePage} />
            <Tab.Screen name={"Marketer"} component={Marketer} />
            <Tab.Screen name={"Chatbot"} component={Chatbot} />
        </Tab.Navigator>
    );
}
