import { Calendar, LocaleConfig } from "react-native-calendars";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button, Overlay } from "react-native-elements";
import { connect } from "react-redux";
import AppLoading from "expo-app-loading"; //npm i expo-app-loading

// IMPORT DES FONTS
import {
  useFonts,
  PTSans_400Regular,
  PTSans_400Regular_Italic,
  PTSans_700Bold,
  PTSans_700Bold_Italic,
} from "@expo-google-fonts/pt-sans"; //@expo-google-fonts/pt-sans

var moment = require("moment");

//Pour mettre le calendrier en français
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
  firstDayMonday: true, //Pourquoi ça marche pas ???
};
LocaleConfig.defaultLocale = "fr";

function DashBoardScreen(props) {
  const [visible, setVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState([{}]);
  const [exams, setExams] = useState([]);
  const [firstName, setFirstName] = useState("");

  //Fonts
  let [fontsLoaded] = useFonts({
    PTSans_400Regular,
    PTSans_400Regular_Italic,
    PTSans_700Bold,
    PTSans_700Bold_Italic,
  });

  //Récupération des vaccins et tests médicaux en BDD
  useEffect(() => {
    async function takeExams() {

      let brutResponse = await fetch(
        `https://life-yourapp.herokuapp.com/profil/${props.token}`
      );
      let jsonResponse = await brutResponse.json();
      let vaccinesList = jsonResponse.user.vaccines;
      let medicalTestsList = jsonResponse.user.medicalTests;
      let firstname = jsonResponse.user.firstname;
      setFirstName(firstname);

      //Création d'un tableau avec TOUS les examens (vaccins et test médicaux) sous forme d'objets {date: , name: }
      let temp = [];
      for (let i = 0; i < vaccinesList.length; i++) {
        let date = new Date(vaccinesList[i].endDate);
        let dateFormated = moment(date).format("YYYY-MM-DD");
        temp.push({
          name: vaccinesList[i].name,
          date: dateFormated,
        });
      }

      for (let i = 0; i < medicalTestsList.length; i++) {
        let date = new Date(medicalTestsList[i].endDate);
        let dateFormated = moment(date).format("YYYY-MM-DD");

        temp.push({
          name: medicalTestsList[i].name,
          date: dateFormated,
        });
      }

      setExams(temp);
    }
    if (props.token) {
      takeExams();
    }
  }, [overlayContent]);

  let markedDates = {};

  //Création des marqueurs de couleur sur le calendrier en fonction de l'échéance
  //Passée = rouge
  //Moins de 32 jours = orange
  //Plus de 32 jours = vert
  for (let i = 0; i < exams.length; i++) {
    let examDate = new Date(exams[i].date);
    let todayDate = new Date();

    let delta = (examDate - todayDate) / (1000 * 3600 * 24); // *1000 => pour convertir en secondes, *3600 => pour convertir en heures, *24 => pour convertir en jours

    if (delta < 0) {
      markedDates[exams[i].date] = { selected: true, selectedColor: "red" };
    } else if (delta < 32) {
      markedDates[exams[i].date] = { selected: true, selectedColor: "orange" };
    } else if (delta > 32) {
      markedDates[exams[i].date] = { selected: true, selectedColor: "green" };
    }
  }



  //**************FETCH API*****************

  //Variable qui va stocker les données API
  const temp = [];
  //Fonction qui exploite les données API
  async function loadData() {
    var rawResponse = await fetch(
      "https://data.opendatasoft.com/api/records/1.0/search/?dataset=medecins%40public&q=&rows=200"
    );
    var response = await rawResponse.json();
    //Boucle pour push les données API dans le tableau "temp"
    for (let item of response.records) {
      if (
        item.fields.coordonnees &&
        item.fields.libelle_regroupement != "none" &&
        item.fields.libelle_regroupement != "None" &&
        item.fields.libelle_regroupement != undefined
      ) {
        temp.push({
          latitude: item.fields.coordonnees[0],
          longitude: item.fields.coordonnees[1],
          profession: item.fields.libelle_profession,
          categorie: item.fields.libelle_regroupement,
          adresse: item.fields.adresse,
          ville: item.fields.commune,
          tel: item.fields.column_10,
          secteur: item.fields.column_14,
        });
      }
    }
    props.navigation.navigate("MapScreen", {
      screen: "MapScreen",
      listAPI: temp,
    });
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Overlay
          overlayStyle={{ flex: 0.5, width: 300, borderRadius: 50 }}
          width="5000"
          isVisible={visible}
          onBackdropPress={() => {
            setVisible(false);
          }}
        >
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text style={{ fontSize: 30 }}>{overlayContent[0].date}</Text>
            <Text style={{ fontSize: 30 }}>{overlayContent[0].name}</Text>
          </View>
        </Overlay>
        <Text
          style={{
            marginTop: 40,
            marginBottom: 15,
            fontSize: 30,
            color: "green",
            fontStyle: "italic",
          }}
        >
          Bonjour {firstName} !
        </Text>
        <ScrollView>
          <Button
            buttonStyle={styles.bigButton}
            title="Profil santé"
            onPress={() =>
              props.navigation.navigate("ProfilScreen", { screen: "ProfilScreen" })
            }
          />
          <Button
            buttonStyle={styles.bigButton}
            title="Trouver un spécialiste"
            onPress={() => loadData()}
          />
          <Button
            buttonStyle={styles.bigButton}
            title="Mes lieux de santé"
            onPress={() =>
              props.navigation.navigate("AddressBookScreen", {
                screen: "AddressBookScreen",
              })
            }
          />
          <Button
            buttonStyle={styles.bigButton}
            title="Ajouter un profil"
            onPress={() =>
              props.navigation.navigate("AddProfileScreen", {
                screen: "AddProfileScreen",
              })
            }
          />
          <Calendar
            locale="fr"
            onDayPress={(day) => {
              if (visible === false) {
                let filter = exams.filter((e) => e.date === day.dateString);

                if (filter[0] !== undefined) {
                  let temp = new Date(filter[0].date);
                  let dateFormated = moment(temp).format("DD-MM-YYYY");
                  filter[0].date = dateFormated;

                  setVisible(true);
                  setOverlayContent(filter);
                } else if (filter[0] === undefined) {
                  filter.push({ date: day.dateString, name: "Pas d'examen prévu" });
                  let temp = new Date(filter[0].date);
                  let dateFormated = moment(temp).format("DD-MM-YYYY");
                  filter[0].date = dateFormated;
                  setVisible(true);
                  setOverlayContent(filter);
                }
              } else if (visible === true) {
                setVisible(false);
              }
            }}
            style={styles.calendar}
            markedDates={markedDates}
          />
        </ScrollView>
      </View >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBFAD5",
    alignItems: "center",
    justifyContent: "center",
  },
  bigButton: {
    backgroundColor: "#5BAA62",
    marginBottom: 10,
    borderRadius: 50,
    height: 50,
    width: 300,
  },
  calendar: {
    width: 300,
    marginTop: 10,
  },
});

function mapStateToProps(state) {
  return { token: state.token };
}

export default connect(mapStateToProps, null)(DashBoardScreen);
