// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> IMPORT DES DIFFERENTES LIBRAIRIES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
import React, { useState, useEffect } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

import { connect } from "react-redux";

var moment = require("moment");

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> COMPOSENT MODAL INFOS ICÔNES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
const ModalDelete = ({ visible, children }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FONCTION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
function SettingScreen(props) {
  // //DropDownPicker Sexe
  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  // const [sex, setSex] = useState([
  //   { label: "Homme", value: "Homme" },
  //   { label: "Femme", value: "Femme" },
  // ]);

  // //DropDownPicker Job
  // const [open2, setOpen2] = useState(false);
  // const [value2, setValue2] = useState(null);
  // const [job, setJob] = useState([
  //   { label: "Militaire", value: "Militaire" },
  //   { label: "Médical", value: "Médical" },
  //   { label: "Autre", value: "Autre" },
  // ]);

  // //DropDownPicker Pathos
  // const [open3, setOpen3] = useState(false);
  // const [value3, setValue3] = useState([]);
  // const [pathos, setPathos] = useState([
  //   { label: "Diabète", value: "Diabète" },
  //   { label: "Endométriose", value: "Endométriose" },
  //   { label: "Cholestérol", value: "Cholestérol" },
  // ]);

  // //DropDownPicker Antécédents
  // const [open4, setOpen4] = useState(false);
  // const [value4, setValue4] = useState([]);
  // const [ante, setAnte] = useState([
  //   { label: "Diabète", value: "Diabète" },
  //   { label: "Endométriose", value: "Endométriose" },
  //   { label: "Cholestérol", value: "Cholestérol" },
  // ]);

  //Fonction Click Valider => infos vers Backend
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [sexe, setSexe] = useState("");
  const [profession, setProfession] = useState("");
  const [illnesses, setIllnesses] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);


  /* Fonctions pour boutons à la fin du formulaire */
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  //Bouton déconnection
  const deconnectAccount = () => {
    props.navigation.navigate("LogScreen", {
      screen: "LogScreen",
    });
    setLogout(true);
    //Le user est redirigé ver le LogScreen s'il choisi de se déconnecter
  };

  //Bouton suppression
  const deleteButton = () => {
    setSup(true);
    setModalDeleteVisible(true);
  };

  //Bouton valider dans modal de suppression de compte
  const deleteAccount = () => {
    props.navigation.navigate("DeleteAccountScreen", {
      screen: "DeleteAccountScreen",
    });
    setModalDeleteVisible(false);
  };

  //CheckBox
  const [checked, setChecked] = useState(false);

  //UseEffect de récupération des données User

  useEffect(() => {
    async function userData() {

      let brutResponse = await fetch(
        `https://life-yourapp.herokuapp.com/profil/${props.token}`
      );
      let jsonResponse = await brutResponse.json();
      let firstname = jsonResponse.user.firstname;
      let lastname = jsonResponse.user.lastname;
      let birthdate = new Date(jsonResponse.user.birthdate);
      let dateFormated = moment(birthdate).format("DD-MM-YYYY");
      let sex = jsonResponse.user.sex;
      let profession = jsonResponse.user.profession;
      let illnesses = jsonResponse.user.illnesses;
      let familyHistory = jsonResponse.user.familyHistory;
      let mail = jsonResponse.user.mail;

      setFirstName(firstname);
      setLastName(lastname);
      setBirthdate(dateFormated);
      setSexe(sex);
      setProfession(profession);
      setIllnesses(illnesses)
      setFamilyHistory(familyHistory)
      setEmail(mail)

    }
    userData()
  }, []);

  let illnessesList = illnesses.map((e, i) => (
    <Text style={{ margin: 6 }} key={i}>{e.name}</Text>
  ))

  let familyHistoryList = familyHistory.map((e, i) => (
    <Text style={{ margin: 6 }} key={i}>{e.name}</Text>
  ))

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RETURN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text
          style={{
            marginTop: 60,
            marginBottom: 20,
            fontSize: 30,
            color: "#37663B",
          }}
        >
          Vos informations
        </Text>

        <View style={styles.texte}>
          <Text >Nom</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Dupont"
            editable={false}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={lastName}

          />
          <Button
            buttonStyle={{ width: 60, height: 40, marginLeft: 70, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>

        <View style={styles.texte}>
          <Text >Prénom</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Marie"
            editable={false}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={firstName}
            onChangeText={(value) => setFirstName(value)}
          />
          <Button
            buttonStyle={{ width: 60, height: 40, marginLeft: 70, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>

        <View style={styles.texte}>
          <Text >Date de naissance</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            type="date"
            style={styles.input}
            placeholder="12/05/1982"
            editable={false}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={birthdate}
            onChangeText={(value) => setBirthdate(new Date(value))}
          />
          <Button
            buttonStyle={{ width: 60, height: 40, marginLeft: 70, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>

        <View style={styles.texte}>
          <Text >Sexe</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            editable={false}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={sexe}
            onChangeText={(value) => setBirthdate(new Date(value))}
          />
          <Button
            buttonStyle={{ width: 60, height: 40, marginLeft: 70, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>

        <View style={styles.texte}>
          <Text >Profession</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            editable={false}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            value={profession}
            onChangeText={(value) => setBirthdate(new Date(value))}
          />
          <Button
            buttonStyle={{ width: 60, height: 40, marginLeft: 70, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>
        <Text
          style={{
            marginTop: 30,
            marginBottom: 20,
            fontSize: 15,
            color: "#37663B",
            textAlign: "center",
          }}
        >
          Informations complémentaires de santé
        </Text>
        <View style={styles.texte}>
          <Text >Pathologies</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", marginRight: 23 }}>
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row" }}>
              {illnessesList}
            </View>
          </View>
          <Button
            buttonStyle={{ width: 60, height: 40, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>
        <View style={styles.texte}>
          <Text >Antécédents familiaux</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", marginRight: 23 }}>
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row" }}>
              {familyHistoryList}
            </View>
          </View>
          <Button
            buttonStyle={{ width: 60, height: 40, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>

        <Text
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 15,
            color: "#37663B",
            textAlign: "center",
          }}
        >
          Informations de connexion
        </Text>

        <View style={styles.inputContainer}>
          <View>
            <Icon name="mail" color="#5BAA62" size={30} />
          </View>
          <TextInput
            placeholder="Email"
            editable={false}
            style={styles.input}
            underlineColor="transparent"
            theme={{ colors: { primary: "#5BAA62" } }}
            value={email}
            onChangeText={(value) => setEmail(value)}
            leftIcon={<Icon name="mail" color="#5BAA62" size={30} />}
          />
          <Button
            buttonStyle={{ width: 60, height: 40, marginLeft: 40, backgroundColor: "#5BAA62" }}
            title="Modifier"
            titleStyle={{ fontSize: 11 }}

          />
        </View>
        <Button
          buttonStyle={styles.deconnectButton}
          title="Reset password"

        />

        <Button
          buttonStyle={styles.deconnectButton}
          title="Se Déconnecter"
          onPress={() => deconnectAccount()}
        />
        <Button
          buttonStyle={styles.deleteButton}
          title="Supprimer mon compte"
          onPress={() => deleteButton()}
        />
      </View>

      {/*>>>>>>>>>>>>>>>>>>>>> Modal Suppression de compte <<<<<<<<<<<<<<<<<<<<<< */}
      <ModalDelete visible={modalDeleteVisible}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setModalDeleteVisible(false)}
            ></TouchableOpacity>
          </View>
        </View>
        <View style={styles.title}>
          <Ionicons
            name="warning"
            size={100}
            color="#FFFFFF"
            onPress={() => setModalDeleteVisible(true)}
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              marginVertical: 30,
              fontSize: 17,
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            Vous êtes sur le point de supprimer votre compte utilisateur. Sa
            suppression est irréversible et entrainera la suppression de
            l'intégralité des informations que vous avez saisie.{" "}
          </Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              center
              status={checked ? "checked" : "unchecked"}
              value={checked}
              checked={checked}
              checkedColor="#FFFFFF"
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text style={styles.textCheckbox}>
              Je confirme la suppression définitive de mon compte
            </Text>
          </View>
          <Button
            title="Valider"
            buttonStyle={styles.buttonModal}
            onPress={() => deleteAccount()}
          />
        </View>
      </ModalDelete>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonModal: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    size: "md",
    backgroundColor: "#37663B",
    width: 100,
    height: 40,
    margin: 15,
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBFAD5",
  },
  deconnectButton: {
    backgroundColor: "#5BAA62",
    borderRadius: 40,
    width: 180,
    height: 50,
    marginTop: 20,
  },
  deleteButton: {
    borderRadius: 40,
    backgroundColor: "#5BAA62",
    width: 250,
    height: 50,
    margin: 10,
  },
  dropDownPicker: {
    height: 30,
    width: 300,
    borderRadius: 0,
    borderColor: "#EBFAD5",
    borderWidth: 0.5,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#FFF",
  },
  input: {
    padding: 7,
    borderRadius: 5,
    width: 170,
    height: 40,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "white",
    marginBottom: 15,
    marginLeft: 30,
    paddingLeft: 5,
    borderRadius: 8,
    height: 40,
    width: 250,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#5BAA62",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  row: {
    alignItems: "center",
  },
  textCheckbox: {
    color: "#FFF",
    justifyContent: "center",
  },
  title: {
    justifyContent: "center",
  },
  texte: {

    width: "80 %"
  }
});
function mapDispatchToProps(dispatch) {
  return {
    tokenStore: function (token) {
      dispatch({ type: "addToken", token: token });
    },
    setUserId: function (userId) {
      dispatch({ type: "addUserId", userId: userId });
    },
  };
}

function mapStateToProps(state) {
  return { token: state.token };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);