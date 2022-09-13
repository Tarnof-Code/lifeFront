// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> IMPORT DES DIFFERENTES LIBRAIRIES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";
import { Dropdown } from "react-native-element-dropdown";
//* Connexion avec redux : npm install --save redux react-redux */
import { connect } from "react-redux";
// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FONCTIONS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
function MapScreen(props) {
  //Variables pour la liste Dropdown
  // const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  // const [items, setItems] = useState();

  //Variables qui vont stocker les données du modèle HCProfessionnal afin de les enregistrer en BDD
  const [profession, setProfession] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [tel, setTel] = useState("");
  const [category, setCategory] = useState("");
  const [secteur, setSecteur] = useState("");

  //Variable qui va stocker les coordonnées en temps réel
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);

  //Variable qui va stocker les types de professionnels de santé par rapport à l'API
  const [jobs, setJobs] = useState([]);




  //Variable qui va rendre visible ou non le modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  //Fonction qui demande l'autorisation de géolocation à l'initialisation du composant
  useEffect(() => {

    async function askPermissions() {
      var { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 2 }, (location) => {
          //Fonction qui récupère la géolocalisation en temps réel tous les 2 mètres
          setCurrentLatitude(location.coords.latitude);
          setCurrentLongitude(location.coords.longitude);

        });
      }
    }

    askPermissions();

    listCategory();
  }, []);

  //Boucle pour supprimer les catégories en doublon et les push dans le tableau "jobs"
  function listCategory() {
    for (let i = 0; i < props.route.params.listAPI.length; i++) {
      //push dans le tableau ttes les catégories
      jobs.push({
        label: props.route.params.listAPI[i].categorie,
        value: props.route.params.listAPI[i].categorie,
      });
      //exploiter le tableau d'objets
      let jsonObject = jobs.map(JSON.stringify);
      let uniqSet = new Set(jsonObject);
      //créé un nouveau tableau d'objets uniques !
      let newArr = Array.from(uniqSet).map(JSON.parse);
      setJobs(newArr.sort());
    }

  }

  //Variable qui capture la valeur sélectionnée du dropdown
  const [catMap, setcatMap] = useState("");
  //Fonction : map un nvx tableau à partir de celui de l'API pour créer un tableau de markers et en fonction de la catégorie sélectionnée
  let tab = props.route.params.listAPI;
  let markerlist = tab
    .filter((el) => el.categorie == catMap.label || !catMap)
    .map((marker, i) => {
      let infos = {
        Profession: marker.profession.toUpperCase(),
        Adresse: capsF(marker.adresse),
        Ville: marker.ville,
        Tel: marker.tel,
        Secteur: marker.secteur,
        Categorie: marker.categorie,
      };
      return (
        <Marker
          key={i}
          pinColor="blue"
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          onPress={() => {
            setModalVisible(!modalVisible);
            props.pushInfos(infos);
            setProfession(marker.profession);
            setAdresse(marker.adresse);
            setVille(marker.ville);
            setTel(marker.tel);
            setSecteur(marker.secteur);
            setCategory(marker.categorie);

          }}
        >
        </Marker>
      );
    });

  let addHCPro = (profession, adresse, ville, tel, category, secteur) => {
    async function HCPro() {

      let fetchRouteAddhcpro = await fetch(
        `https://life-yourapp.herokuapp.com/addhcpro/${props.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `professionFromFront=${profession}&adresseFromFront=${adresse}&villeFromFront=${ville}&telFromFront=${tel}&categoryFromFront=${category}&secteurFromFront=${secteur}`,
        }
      );
      let saveHCPro = await fetchRouteAddhcpro.json();
    }
    HCPro();
  };

  //Fonction qui met en majusucle la 1ère lettre de chaque mot
  function capsF(words) {
    var separateWord = words.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] =
        separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
  }

  // *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RETURN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
  return (
    <View style={styles.container}>
      <View style={{ position: "relative" }}>
        <View>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={jobs}
            maxHeight={300}
            labelField="label"
            valueField="value"
            activeColor="#EBFAD5"
            placeholder="Rechercher.."
            value={value}
            dropdownPosition="auto"
            onChange={(item) => setcatMap(item)}
            onPress={() => {
              mapCategory();
            }}
            renderLeftIcon={() => (
              <Entypo
                style={styles.icon}
                color="#5BAA62"
                name="leaf"
                size={20}
              />
            )}
          />
        </View>
        <MapView
          style={styles.map}
          // mapPadding={60}
          initialRegion={{
            // latitude: 43.604652, // pour centrer la carte
            // longitude: 1.444209,
            latitude: 46.160329,
            longitude: -1.151139,

            // latitudeDelta: 0.048, // le rayon à afficher à partir du centre
            // longitudeDelta: 0.028,
            latitudeDelta: 2, // le rayon à afficher à partir du centre
            longitudeDelta: 1,
          }}
        >
          <Marker
            key={"currentPos"}
            pinColor="red"
            title="Vous êtes ici"
            coordinate={{
              latitude: 46.160329,
              longitude: -1.151139,
            }}
            draggable
          ></Marker>
          {markerlist}
        </MapView>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
          >
            <View style={styles.modalView}>
              <Button
                icon={{
                  name: "cross",
                  type: "entypo",
                  size: 35,
                  color: "#e74c3c",
                }}
                buttonStyle={{
                  backgroundColor: "transparent",
                  marginLeft: 265,
                  paddingBottom: -5,
                }}
                onPress={() => setModalVisible(!modalVisible)}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#5BAA62",
                  marginBottom: 8,
                }}
              >
                <Entypo color="#5BAA62" name="leaf" size={18} />{" "}
                {props.dataMedecin.Profession}
              </Text>
              <Text style={styles.modalText}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#37663B" />{" "}
                <Text
                  style={{
                    fontSize: 12,
                    color: "#37663B",
                    fontWeight: "bold",
                  }}
                >
                  ADRESSE :
                </Text>{" "}
                {props.dataMedecin.Adresse}
                {"\n"}
                <FontAwesome5 name="phone-alt" size={12} color="#37663B" />{" "}{" "}
                <Text
                  style={{
                    fontSize: 12,
                    color: "#37663B",
                    fontWeight: "bold",
                  }}
                >
                  TEL :
                </Text>{" "}
                {props.dataMedecin.Tel}
                {"\n"}
                <Text
                  style={{
                    fontSize: 12,
                    color: "#37663B",
                    fontWeight: "bold",
                  }}
                >
                  SECTEUR :
                </Text>{" "}
                {props.dataMedecin.Secteur}
              </Text>
              <Button
                title="Ajouter en favori"
                buttonStyle={{
                  backgroundColor: "#5BAA62",
                  fontStyle: "italic",
                  fontSize: 10,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setModalVisible2(!modalVisible2);
                  addHCPro(profession, adresse, ville, tel, category, secteur);
                }}
              />
            </View>
          </Modal>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible2);
            }}
          >
            <View style={styles.modalView2}>
              <Pressable onPress={() => setModalVisible2(!modalVisible2)}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#ffff",
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  Le professionnel de santé a bien été ajouté à votre carnet
                  d'adresses !
                </Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}

// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STYLES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBFAD5",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  dropdown: {
    margin: 8,
    height: 60,
    marginTop: 50,
    width: "auto",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderColor: "#5BAA62",
    borderWidth: 0,
    backgroundColor: "white",
    padding: 12,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#7f8c8d",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontStyle: "italic",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  modalView: {
    paddingTop: 5,
    paddingRight: -10,
    backgroundColor: "white",
    borderWidth: 1,
    borderTopColor: "transparent",
    borderBottomColor: "#5BAA62",
    borderBottomWidth: 3,
    padding: 22,
    alignItems: "flex-start",
    shadowColor: "#5BAA62",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalText: {
    marginBottom: 15,
    paddingRight: 14,
    textAlign: "justify",
    fontSize: 13,
  },
  modalView2: {
    backgroundColor: "#5BAA62",
    padding: 15,
    marginLeft: 30,
    marginTop: 350,
    width: 300,
    heigth: 100,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    pushInfos: function (infos) {
      dispatch({ type: "AddSoin", datas: infos });
    },
  };
}

function mapStateToProps(state) {
  return { dataMedecin: state.etab, token: state.token };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
