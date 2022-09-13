import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { CheckBox, Button } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { connect } from "react-redux";
import { TextInput } from "react-native-paper";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function SignUpInfosScreen(props) {
  //DropDownPicker Sexe
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [sex, setSex] = useState([
    { label: "Homme", value: "Homme" },
    { label: "Femme", value: "Femme" },
  ]);

  //DropDownPicker Job
  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState(null);
  const [job, setJob] = useState([
    { label: "Militaire", value: "Militaire" },
    { label: "Médical", value: "Médical" },
    { label: "Autre", value: "Autre" },
  ]);

  //DropDownPicker Pathos
  const [open3, setOpen3] = useState(false);
  const [value3, setValue3] = useState([]);
  const [pathos, setPathos] = useState([
    { label: "Diabète", value: "Diabète" },
    { label: "endométriose", value: "endométriose" },
    { label: "Cholestérol", value: "Cholestérol" },
  ]);

  //DropDownPicker Antécédents
  const [open4, setOpen4] = useState(false);
  const [value4, setValue4] = useState([]);
  const [ante, setAnte] = useState([
    { label: "Diabète", value: "Diabète" },
    { label: "endométriose", value: "endométriose" },
    { label: "Cholestérol", value: "Cholestérol" },
  ]);

  //CheckBox1
  const [check, setCheck] = useState(false);

  //CheckBox1
  const [check2, setCheck2] = useState(false);

  //Fonction Click Valider => infos vers Backend
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sexe, setSexe] = useState("");
  const [profession, setProfession] = useState("");
  const [illnesses, setIllnesses] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [pwdConfirmed, setPwdConfirmed] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordVisible2, setPasswordVisible2] = useState(true);

  //Etats pour notifications
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [healthTestsState, setHealthTestsState] = useState([])

  var healthTests = [];
  async function schedulePushNotification() {

    for (let i = 0; i < healthTests.length; i++) {

      const trigger = Date.now() + 10000

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rappel santé`,
          body: `Consultez Life`,
          data: { data: 'goes here' },
        },
        trigger,
      });

    }
  }

  var handleSubmitSignUp = (
    email,
    password,
    firstName,
    lastName,
    birthdate,
    sexe,
    profession,
    illnesses,
    familyHistory
  ) => {

    async function addUser() {
      //Remplacer privateIp par la vôtre
      let rawRecUser = await fetch(
        `https://life-yourapp.herokuapp.com/sign-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `emailFromFront=${email}&passwordFromFront=${password}&firstnameFromFront=${firstName}&lastnameFromFront=${lastName}&birthdateFromFront=${birthdate}&sexFromFront=${sexe}&professionFromFront=${profession}&illnessesFromFront=${illnesses}&familyHistoryFromFront=${familyHistory}`,
        }
      );
      var recUser = await rawRecUser.json();

      if (recUser.result === true) {
        healthTests = recUser.currentUser.vaccines.concat(recUser.currentUser.medicalTests);

        setHealthTestsState([...healthTests]);

        props.tokenStore(recUser.currentUser.token);
        props.navigation.navigate("BottomNavigator", {
          screen: "Dashboard",
        });
      }
    }
    if (pwdConfirmed && check === true && check2 === true) {
      addUser();
    }
  };


  useEffect(() => {
    registerForPushNotificationsAsync().then(element => setExpoPushToken(element));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text
          style={{
            marginTop: 55,
            marginLeft: 22,
            marginBottom: 10,
            fontSize: 22,
            color: "#5BAA62",
            fontStyle: "italic",
          }}
        >
          Vos informations
        </Text>
        <TextInput
          icon="key"
          style={styles.input}
          placeholder="Nom"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={lastName}
          onChangeText={(value) => setLastName(value)}
        />
        <TextInput
          icon="key"
          style={styles.input}
          placeholder="Prénom"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={firstName}
          onChangeText={(value) => setFirstName(value)}
        />
        <TextInput
          type="date"
          icon="key"
          style={styles.input}
          placeholder="Date de naissance MM/JJ/AAAA"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={birthdate}
          onChangeText={(value) => setBirthdate(new Date(value))}
        />

        <View>
          <DropDownPicker
            listMode="SCROLLVIEW"
            style={styles.dropDownPicker}
            dropDownContainerStyle={{ width: 300 }}
            open={open}
            value={value}
            items={sex}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setSex}
            placeholder="Sexe"
            placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
            onChangeValue={(value) => {
              setSexe(value);
            }}
          />
          <DropDownPicker
            listMode="SCROLLVIEW"
            style={styles.dropDownPicker}
            dropDownContainerStyle={{ width: 300 }}
            open={open2}
            value={value2}
            items={job}
            setOpen={setOpen2}
            setValue={setValue2}
            placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
            setItems={setJob}
            onChangeValue={(value) => {
              setProfession(value);
            }}
            placeholder="Catégorie professionnelle"
          />

          <Text
            style={{
              marginTop: 15,
              fontSize: 13,
              color: "green",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Informations complémentaires de santé
          </Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            style={styles.dropDownPicker}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={{ width: 300 }}
            open={open3}
            value={value3}
            items={pathos}
            setOpen={setOpen3}
            setValue={setValue3}
            placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
            setItems={setPathos}
            onChangeValue={(value) => {
              setIllnesses(value);
            }}
            placeholder="Pathologies"
            theme="LIGHT"
            multiple={true} //Permet de sélectionner plusieurs options
            min={0}
            mode="BADGE"
            valueStyle={{
              fontWeight: "bold",
            }}
          />
          <DropDownPicker
            listMode="SCROLLVIEW"
            style={styles.dropDownPicker}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={{ width: 300 }}
            open={open4}
            value={value4}
            items={ante}
            setOpen={setOpen4}
            placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
            setValue={setValue4}
            setItems={setAnte}
            onChangeValue={(value) => {
              setFamilyHistory(value);
            }}
            placeholder="Antécédents familiaux"
            theme="LIGHT"
            multiple={true} //Permet de sélectionner plusieurs options
            min={0}
            mode="BADGE"
            valueStyle={{
              fontWeight: "bold",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 15,
            fontSize: 13,
            color: "green",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Informations de connexion
        </Text>
        <TextInput
          icon="key"
          style={styles.input}
          placeholder="email"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
        <TextInput
          type="password"
          icon="key"
          style={styles.input}
          placeholder="Mot de passe"
          autoCorrect={false}
          secureTextEntry={passwordVisible}
          underlineColorAndroid="transparent"
          value={password}
          onChangeText={(value) => setPassword(value)}
          right={
            <TextInput.Icon
              name={passwordVisible ? "eye" : "eye-off"}
              color="#5BAA62"
              size={30}
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{
                marginTop: "90%",
              }}
            />
          }
        />
        <TextInput
          icon="key"
          style={styles.input}
          placeholder="Confirmer Mot de passe"
          autoCorrect={false}
          secureTextEntry={passwordVisible2}
          underlineColorAndroid="transparent"
          value={password2}
          onChangeText={(value) => {
            setPassword2(value);
            if (value === password) {
              setPwdConfirmed(true);
            } else {
              setPwdConfirmed(false);
            }
          }}
          right={
            <TextInput.Icon
              name={passwordVisible2 ? "eye" : "eye-off"}
              color="#5BAA62"
              size={30}
              style={{
                marginTop: "90%",
              }}
              onPress={() => setPasswordVisible2(!passwordVisible2)}
            />
          }
        />
        {!pwdConfirmed && (
          <Text
            style={{
              marginTop: 1,
              marginBottom: 8,
              fontSize: 13,
              color: "red",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Veuillez entrer le même mot de passe
          </Text>
        )}
        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={check}
            checkedColor="#5BAA62"
            onPress={() => {
              if (check === false) {
                setCheck(true);
              } else if (check === true) {
                setCheck(false);
              }
            }}
          />
          <Text
            style={{
              color: "#37663B",
              marginLeft: -6,
              paddingLeft: 2.5,
              paddingRight: 8,
            }}
          >
            Je certifie sur l'honneur l'exactitude des renseignements fournis.
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            checkedColor="#5BAA62"
            checked={check2}
            onPress={() => {
              if (check2 === false) {
                setCheck2(true);
              } else if (check2 === true) {
                setCheck2(false);
              }
            }}
          />
          <Text
            style={{
              color: "#37663B",
              marginLeft: -6,
              paddingLeft: 5,
              paddingRight: 8,
            }}
          >
            Veuillez accepter les conditions d'utilisation
          </Text>
        </View>
        <View>
          {(!check || !check2) && (
            <Text
              style={{
                marginTop: 1,
                marginBottom: 8,
                fontSize: 13,
                color: "red",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Veuillez cocher les cases
            </Text>
          )}
        </View>
        <Button
          buttonStyle={styles.smallButton}
          title="Valider"
          onPress={() => {
            handleSubmitSignUp(
              email,
              password,
              firstName,
              lastName,
              birthdate,
              sexe,
              profession,
              illnesses,
              familyHistory
            )

            setTimeout(async () => { await schedulePushNotification() }, 2000);
          }
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBFAD5",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 18,
    width: 300,
    margin: 12,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    fontStyle: "italic",
    color: "#576574",
  },
  dropDownPicker: {
    width: 300,
    marginVertical: 5,
    zIndex: -1,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderColor: "#5BAA62",
    borderWidth: 0,
  },
  smallButton: {
    backgroundColor: "#5BAA62",
    marginTop: 10,
    borderRadius: 50,
    height: 50,
    width: 150,
    marginBottom: 15,
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 9,
  },
});
function mapDispatchToProps(dispatch) {
  return {
    tokenStore: function (token) {
      dispatch({ type: "addToken", token: token });
    },
  };
}



async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default connect(null, mapDispatchToProps)(SignUpInfosScreen);
