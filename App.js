// CODES DÉSACTIVATION WARNING SUR MOBILE
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
import { ViewPropTypes } from "deprecated-react-native-prop-types";

// IMPORT DES DIFFERENTES LIBRAIRIES
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

// IMPORT DES DIFFERENTS COMPOSANTS NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// IMPORT DES DIFFERENTS COMPOSANTS SCREEN
import DashboardScreen from "./screens/DashboardScreen";
import LogScreen from "./screens/LogScreen";
import ProfilScreen from "./screens/ProfilScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MapScreen from "./screens/MapScreen";
import AddressBookScreen from "./screens/AddressBookScreen";
import SignUpInfoScreen from "./screens/SignUpInfoScreen";
import AddProfileScreen from "./screens/AddProfileScreen";
import DeleteAccountScreen from "./screens/DeleteAccountScreen";

// NAVIGATION
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// <<<<<<<<<<<<<<<<<<<< J'INITIALISE LE STORE >>>>>>>>>>>>>>>>>>>>>>
/* J'importe les reducers */
import mail from "./reducers/mail";
import userId from "./reducers/userId";
import etab from "./reducers/healthcarepro";
import token from "./reducers/token";
import list from "./reducers/list";

/* J'importe le Provider */
import { Provider } from "react-redux";
/* J'importe le Store */
import { createStore, combineReducers } from "redux";
/* Je crée le store */
const store = createStore(combineReducers({ etab, list, mail, userId, token })); //J'appelle les reducers

// FONCTION TABBAR
function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "HOME") {
            iconName = "home";
          } else if (route.name === "PROFIL") {
            iconName = "user";
          } else if (route.name === "SETTINGS") {
            iconName = "gear";
          }
          return <FontAwesome name={iconName} size={27} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#FFFFFF",
        inactiveTintColor: "#B6E5BB",
        activeBackgroundColor: "#5BAA62",
        inactiveBackgroundColor: "#5BAA62",
        style: {
          borderBottomColor: "#37663B",
          borderBottomWidth: 6,
          backgroundColor: "#5BAA62",
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        labelStyle: {
          fontSize: 10,
          paddingTop: 2,
        },
      }}
    >
      <Tab.Screen name="HOME" component={DashboardScreen} />
      <Tab.Screen name="PROFIL" component={ProfilScreen} />
      <Tab.Screen name="SETTINGS" component={SettingsScreen} />

      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="LogScreen"
        component={LogScreen}
      />
      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="BottomNavigator"
        component={BottomNavigator}
      />
      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="MapScreen"
        component={MapScreen}
      />
      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="SignUpInfoScreen"
        component={SignUpInfoScreen}
      />
      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="AddressBookScreen"
        component={AddressBookScreen}
      />
      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="AddProfileScreen"
        component={AddProfileScreen}
      />
      <Tab.Screen
        options={{ tabBarButton: () => null }}
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
      />
    </Tab.Navigator>
  );
}

// FONCTION NAVIGATION
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer style={styles.container}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LogScreen" component={LogScreen} />
          <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="SignUpInfoScreen" component={SignUpInfoScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="ProfilScreen" component={ProfilScreen} />
          <Stack.Screen
            name="AddressBookScreen"
            component={AddressBookScreen}
          />
          <Stack.Screen name="AddProfileScreen" component={AddProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="DeleteAccountScreen"
            component={DeleteAccountScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBFAD5",
    alignItems: "center",
    justifyContent: "center",
  },
});
