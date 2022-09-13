// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> IMPORT DES DIFFERENTES LIBRAIRIES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
import React, { useState, useEffect } from "react";
import {
  Animated,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppLoading from "expo-app-loading"; //npm i expo-app-loading
import { Button, Text } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker"; //npm install react-native-dropdown-picker
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker"; //npm install @react-native-community/datetimepicker --save
//Librairie avec laquelle pas besoin de gérer le zIndex
import { Dropdown } from "react-native-element-dropdown"; //npm install react-native-element-dropdown --save

import Icon from "react-native-vector-icons/Ionicons";

// IMPORT DES FONTS
import {
  useFonts,
  PTSans_400Regular,
  PTSans_400Regular_Italic,
  PTSans_700Bold,
  PTSans_700Bold_Italic,
} from "@expo-google-fonts/pt-sans"; //@expo-google-fonts/pt-sans

//* Connexion avec redux : npm install --save redux react-redux */
import { connect } from "react-redux";

// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> COMPOSENT MODAL INFOS ICÔNES & DÉFINITIONS VACCINS/EXAMENS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
const ModalInfos = ({ visible, children }) => {
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

// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FONCTION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
function ProfilScreen(props) {
  // *>>>>>>>>>>>>>> FUSION BACK ET FRONT <<<<<<<<<<<<<<<<* //
  const [vaccines, setVaccines] = useState([]);
  const [medicalTests, setMedicalTests] = useState([]);
  const [userFamily, setUserFamily] = useState([]);
  const [firstnameUser, setFirstnameUser] = useState("");


  useEffect(() => {
    async function fetchUserInfo() {
      let brutResponse = await fetch(
        `https://life-yourapp.herokuapp.com/profil/${props.token}` //Récupération du token depuis le reducer pour l'envoyer au back, on respecter structure url
      );
      let jsonResponse = await brutResponse.json(); //Transforme réponse en format json
      setVaccines(jsonResponse.user.vaccines);
      setMedicalTests(jsonResponse.user.medicalTests);
      setUserFamily(jsonResponse.userFamily.family); //Récuper les proches du user principal
      setFirstnameUser(jsonResponse.user.firstname); //Récuper le prénom du user principal
    }
    fetchUserInfo(); //Premier argument du useEffect
    // setTimeout(itemSetter(), 5000);
  }, []);

  //Dropdown list filtre
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([
    "Examen de santé",
    "Vaccin",
    "Obligatoire",
    "Recommandé",
    "Personnel",
  ]);

  const [items, setItems] = useState([

    //Catégorie
    { label: "Catégorie", value: "Catégorie", disabled: true },
    { label: "Vaccin", value: "Vaccin", parent: "Catégorie" },
    { label: "Examen de santé", value: "Examen de santé", parent: "Catégorie" },

    //Priorité
    { label: "Priorité", value: "Priorité", disabled: true },
    { label: "Obligatoire", value: "Obligatoire", parent: "Priorité" },
    { label: "Recommandé", value: "Recommandé", parent: "Priorité" },
    { label: "Personnel", value: "Personnel", parent: "Priorité" },

    //Priorité
    { label: "Échéancé", value: "Échéancé", disabled: true },
    { label: "Mois prochain", value: "Mois prochain", parent: "Échéancé" },
    {
      label: "6 prochains mois",
      value: "6 prochains mois",
      parent: "Échéancé",
    },
    { label: "Annuelle", value: "Annuelle", parent: "Échéancé" },

    //État
    { label: "État", value: "État", disabled: true },
    { label: "À programmer", value: "À programmer", parent: "État" },
    { label: "Fait", value: "Fait", parent: "État" },
    { label: "Prévus", value: "Prévus", parent: "État" },
  ]);


  let tempArray = items;
  const [tempState, setTempState] = useState({});
  // const [exams, setExams] = useState({});

  /* DropDownPicker État */
  // 5 ouvertures individuelles pour les 6 dropdown
  // const [open1, setOpen1] = useState(false);

  // Valeurs individuelles pour les 6 dropdown
  const [value6, setValue6] = useState(null);
  const [value8, setValue8] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  //Valeurs DropDown état
  const [state1, setState1] = useState([
    { label: "À jour du :", value: "À jour du :" },
    { label: "À programmer", value: "À programmer" },
    { label: "Programmé le :", value: "Programmé le :" },
  ]);
  // const [state2, setState2] = useState([
  //   { label: "À jour du :", value: "À jour du :" },
  //   { label: "À programmer", value: "À programmer" },
  //   { label: "Programmé le :", value: "Programmé le :" },
  // ]);
  // const [state3, setState3] = useState([
  //   { label: "À jour du :", value: "À jour du :" },
  //   { label: "À programmer", value: "À programmer" },
  //   { label: "Programmé le :", value: "Programmé le :" },
  // ]);
  const [state4, setState4] = useState([
    { label: "À jour du :", value: "À jour du :" },
    { label: "À programmer", value: "À programmer" },
    { label: "Programmé le :", value: "Programmé le :" },
  ]);
  const [state5, setState5] = useState([
    { label: "À jour du :", value: "À jour du :" },
    { label: "À programmer", value: "À programmer" },
    { label: "Programmé le :", value: "Programmé le :" },
  ]);
  const [state6, setState6] = useState([
    { label: "À jour du :", value: "À jour du :" },
    { label: "À programmer", value: "À programmer" },
    { label: "Programmé le :", value: "Programmé le :" },
  ]);
  const [state7, setState7] = useState([
    { label: "À jour du :", value: "À jour du :" },
    { label: "À programmer", value: "À programmer" },
    { label: "Programmé le :", value: "Programmé le :" },
  ]);

  // const [filters, setFilters] = useState([
  //   {
  //     label: "Vaccin",
  //     parent: "Catégorie",
  //     value: "Vaccin",
  //   },
  //   {
  //     label: "Examen de santé",
  //     parent: "Catégorie",
  //     value: "Examen de santé",
  //   },
  //   {
  //     label: "Obligatoire",
  //     parent: "Priorité",
  //     value: "Obligatoire",
  //   },
  //   {
  //     label: "Recommandé",
  //     parent: "Priorité",
  //     value: "Recommandé",
  //   },
  // ]);

  /* ________________ LES DIFFÉRENTS MODALS ________________ */
  /* Les différents modals  apparaissent au clic sur les icones info */
  //Tableau des données infos
  const info = [
    {
      title: "Vaccins obligatoires :",
      info: "11 vaccins sont obligatoires chez les nourrissons nés après le 1er janvier 2018. Trois vaccins restent obligatoires chez les enfants nés avant cette date. Le vaccin contre la fièvre jaune l'est aussi pour les résidents de Guyane française. En milieu professionnel, selon l’activité exercée, certaines vaccinations sont exigées.",
    },
    {
      title: "Vaccins recommandés :",
      info: "Des vaccins existent contre diverses maladies graves telles que la tuberculose, l'hépatite A... S’ils ne sont pas obligatoires, ils restent la meilleure façon d’éviter ces maladies et de protéger les personnes fragiles (nourrissons, femmes enceintes, personnes âgées…). ",
    },
    {
      title: "Vaccins projets personnels :",
      info: "Si vous souhaitez réaliser un vaccin qui n'apparait pas dans la liste des vaccins obligatoires et des vaccins recommandés vous pouvez en ajouter dans la section 'Vaccins projets personnels' en cliquant sur",
    },
    {
      title: "Examens de santé obligatoires :",
      info: "Si vous souhaitez réaliser un vaccin qui n'apparait pas dans la liste des vaccins obligatoires et des vaccins recommandés vous pouvez en ajouter dans la section 'Vaccins projets personnels' en cliquant sur",
    },
    {
      title: "Examens de santé recommandés :",
      info: "Si vous souhaitez réaliser un vaccin qui n'apparait pas dans la liste des vaccins obligatoires et des vaccins recommandés vous pouvez en ajouter dans la section 'Vaccins projets personnels' en cliquant sur",
    },
    {
      title: "Besoins personnels :",
      info: "Si vous souhaitez réaliser un vaccin ou un examen qui n'apparait pas dans la liste des vaccins/examens obligatoires et des vaccins/examens recommandés vous pouvez en ajouter dans la section 'Vaccins/examens projets personnels' en cliquant sur",
    },
  ];

  // Modal Infos Vaccins qui apparait au clic sur l'icône info
  const [modalInfosVisible, setModalInfosVisible] = useState(false);

  // Modal défition diphtérie (Diph)
  const [modalDefVisible, setModalDefVisible] = useState(false);

  // Modal date
  const [modalDate, setModalDate] = useState(false);
  const [modalDate8, setModalDate8] = useState(false);

  /* DateTimePicker */
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [date8, setDate8] = useState(new Date(Date.now()));

  const handleDatePicker = () => {
    setVisible(false);
  };

  // const showDatePicker = () => {
  //   setVisible(!visible);
  // };

  const hideDatePicker = () => {
    setVisible(false);
  };

  const onChange8 = (event, value) => {
    setDate8(value8);
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
  };

  //Modal de définition des vaccins/examens
  const launchModal = (name, description) => {
    setName(name);
    setDescription(description);
    setModalDefVisible(true);
  };

  //Modal du dateTimePicker dans vaccins/examens
  const dateModal = (id, status) => {
    setModalDate(true);
    setTempState({ id, status });
    healthCareDate();
  };

  //Pour le datePicker des vaccins obligatoires et recommandés
  const changeStateVaccines = () => {

    let vaccinesCopy = [...vaccines];
    let index = vaccinesCopy.findIndex((vaccine) => {
      if (vaccine.id === tempState.id) {
        return true;
      } else {
        return false;
      }
    });

    vaccinesCopy[index].date = tempState.date;
    setTempState({});
    setVaccines(vaccinesCopy);
    setModalDate(false);
  };

  //Pour le datePicker des examens obligatoires et recommandés
  const changeStateExams = () => {

    let medicalTestsCopy = [...medicalTests];
    let index = medicalTestsCopy.findIndex((exam) => {
      if (exam.id === tempState.id) {
        return true;
      } else {
        return false;
      }
    });

    medicalTestsCopy[index].date = tempState.date;
    setTempState({});
    setExams(medicalTestsCopy);
    setModalDate(false);
  };

  //Pour le datePicker des besoins personnels
  const changeStateHealthCarePerso = () => {

    let healthCareCopy = [...healthCare];
    let index = healthCareCopy.findIndex((exam) => {
      if (exam.id === tempState.id) {
        return true;
      } else {
        return false;
      }
    });

    healthCareCopy[index].date = tempState.date;
    setTempState({});
    setExams(healthCareCopy);
    setModalDate(false);
  };

  //Modal des infos des vaccins obligatoires
  const infosModal = (text) => {
    for (let item of info) {
      console.log(item);
      if (item.title === text) {
        setName(item.title);
        setDescription(item.info);
      }
    }
    setModalInfosVisible(true);
  };

  //liste dynamique filtre profils
  const itemSetter = () => {

    for (let i = 0; i < userFamily.length; i++) {
      tempArray.unshift({
        label: userFamily[i].firstname,
        value: userFamily[i].firstname,
        parent: "Profil",
      });

    }
    tempArray.unshift({
      label: firstnameUser,
      value: firstnameUser,
      parent: "Profil",
    });

    tempArray.unshift({ label: "Profil", value: "Profil", disabled: true });


    setItems(tempArray);
  };



  useEffect(() => {
    if (userFamily && firstnameUser) {
      itemSetter();
    }
  }, [userFamily, firstnameUser]); //Permet affichage des nom user et family dans le filtre

  /* >>>>>>>>>> Ajout d'une ligne de vaccin au clic sur l'icône + <<<<<<<<<<<<<< */
  const [healthCare, setHealthCare] = useState([]); //Pour garder afficher les vaccins déja ajoutés lorsque le user reclic sur l'icône +
  const [valueVaccine, setValueVaccine] = useState(null); //Pour afficher les valeurs dans le dropDown

  //Valeurs DropDownPicker vaccins
  const [vaccinesName, setVaccinesName] = useState([
    { label: "Coqueluche", value: "Coqueluche" },
    { label: "Fièvre jaune", value: "Fièvre jaune" },
    { label: "Grippe saisonnière", value: "Grippe saisonnière" },
    { label: "Hépatite A", value: "Hépatite A" },
    { label: "Hépatite B", value: "Hépatite B" },
    {
      label: "Infections à Papillomavirus humain",
      value: "Infections à Papillomavirus humain",
    },
    { label: "Rubéole ", value: "Rubéole " },
    { label: "Varicelle", value: "Varicelle" },
  ]);

  const list = []; //Je crée un tableau vide dans lequel je vais pusher les vaccins que le user va ajouter au clic sur l'icône +
  const addHealthCare = () => {
    let val = healthCare.length;

    setHealthCare([...healthCare, { pos: val }]); //Copie de la liste des vaccins ajoutés
  };

  /* Fonction status pour le dropDown d'ajout de soin */
  const healthCareStatus = (item, index) => {
    let status = "A jour";
    let type = "name";
    let position = 0;
    let healthCareCopy = [...healthCare];
    healthCareCopy[index].status = item.value;

  };

  /* Fonction status pour le dropDown des vaccins obligatoires */
  const mandatoryVaccinesStatus = (item, index) => {
    let status = "A jour";
    let type = "name";
    let position = 0;
    let healthCareCopy = [...healthCare];
    // healthCareCopy[index].status = item.value;

  };

  /* Fonction status pour le dropDown des vaccins recommandés */
  const recommendedVaccinesStatus = (item, index) => {
    let status = "A jour";
    let type = "name";
    let position = 0;
    let healthCareCopy = [...healthCare];
    // healthCareCopy[index].status = item.value;

  };

  /* Fonction status pour le dropDown des examens obligatoires */
  const mandatoryExamsStatus = (item, index) => {
    let status = "A jour";
    let type = "name";
    let position = 0;
    let healthCareCopy = [...healthCare];
    // healthCareCopy[index].status = item.value;

  };

  /* Fonction status pour le dropDown des examens recommandés */
  const recommendedExamsStatus = (item, index) => {
    let status = "A jour";
    let type = "name";
    let position = 0;
    let healthCareCopy = [...healthCare];
    // healthCareCopy[index].status = item.value;

  };

  /* Fonction name pour le dropDown d'ajout de soin */
  const healthCareName = (item, index) => {
    let name = "Tétanos";
    let type = "name";
    let position = 0;
    let healthCareCopy = [...healthCare];
    healthCareCopy[index].name = item.value;

  };

  /* Fonction date pour le dropDown d'ajout de soin */
  const healthCareDate = (item, index) => {
    let date = "05/05/2022";
    let type = "date";
    let position = 0;
    let healthCareCopy = [...healthCare];
    healthCareCopy[index].date = item.value;

  };

  //Pour colorer la bordure du dropDown en vert lorsque le user l'ouvre pour sélectionner son choix
  // const [isFocus, setIsFocus] = useState(false);
  const [isFocus1, setIsFocus1] = useState(false);
  // const [isFocus2, setIsFocus2] = useState(false);
  // const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  // const [isFocus5, setIsFocus5] = useState(false);
  const [isFocus6, setIsFocus6] = useState(false);
  const [isFocus7, setIsFocus7] = useState(false);

  /* Je supprime un soin de la liste en cliquant sur l'icône poubelle */
  var deleteHealthCare = (element) => {

    let tempo = [...healthCare];

    for (let i = 0; i < tempo.length; i++) {
      tempo[i].pos = i;
    }
    tempo = tempo.filter((e) => e.pos != element); // Je fais une copie de mon tableau

    setHealthCare(tempo);
    props.deleteToProfil(element);
  };

  //Je map sur vaccinesList pour ajouter une nouvelle ligne de vaccin
  var healthCarePerso = healthCare.map((e, index) => {
    return (
      // Pour supprimer une ligne de soin quand on clique sur la ligne onPress={() => props.deleteHealthCare(element)}
      <View>
        {value.find(
          (element) => element === "Vaccin" || element === "Examen de santé"
        ) && (
            <View
              style={{
                flexDirection: "row",
                minWidth: 360,
                backgroundColor: "white",
              }}
              key={index}
            >
              <Dropdown
                key={index}
                style={styles.dropDownPickerVaccines}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={e.name}
                closeAfterSelecting={true}
                itemSeparator={true}
                listMode="MODAL"
                search //Input recherche
                searchPlaceholder="Recherche..."
                searchable={true} //Permet au user de chercher le nom du vaccin sans avoir besoin de scroller sur la liste de nom proposée
                addCustomItem={true}
                placeholder="Je choisis"
                labelField="label"
                valueField="value"
                data={vaccinesName}
                multiple={false} //Permet de sélectionner une seule option
                dropDownDirection="TOP"
                onChange={(item) => {
                  healthCareName(item, index); //Pour mettre à jour le nom du soin
                }}
              />
              <Dropdown
                key={index}
                style={styles.dropDownPickerState}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                value={e.status}
                placeholder="À renseigner"
                labelField="label"
                valueField="value"
                maxHeight={165}
                data={state5}
                multiple={false} //Permet de sélectionner une seule option
                onChange={(item) => {
                  healthCareStatus(item, index); //Pour mettre à jour le status du soin
                }}
              />
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minWidth: 100,
                  paddingHorizontal: 5,
                }}
              >
                {/* Le bouton pour afficher le dateTimePicker */}
                <TouchableOpacity
                  key={index}
                  onPress={() => dateModal(e.id, e.status)}
                >
                  {/* Affiche la date sélectionnée par le user dans le bouton */}
                  <Text style={{ fontFamily: "PTSans_400Regular" }}>
                    {new Date(e.date).toLocaleDateString("fr-FR")}
                  </Text>
                </TouchableOpacity>
                <Icon
                  key={index}
                  style={{ paddingLeft: 10 }}
                  name="close-circle"
                  color="#5BAA62"
                  size={20}
                  onPress={() => deleteHealthCare(index)}
                />
              </View>
            </View>
          )}
      </View>
    );
  });

  //DateTimePicker
  const changeTempDate = (date) => {
    // console.log(date);
    setTempState({ ...tempState, date });
  };

  //Fonts
  let [fontsLoaded] = useFonts({
    PTSans_400Regular,
    PTSans_400Regular_Italic,
    PTSans_700Bold,
    PTSans_700Bold_Italic,
  });

  // *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RETURN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <DropDownPicker
            style={styles.DropDownPicker}
            open={open}
            placeholder="Aucun filtre sélectionné" //Ce texte apparait si aucun filtre sélectionné
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            autoScroll={true}
            closeOnBackPressed={true}
            listMode="MODAL"
            theme="LIGHT"
            multiple={true} //Permet de sélectionner plusieurs options
            min={0} //Possible de ne rien sélectionner
            // onSelectItem={(item) => setFilterCriteria(item)}
            max={10}
            mode="BADGE"
            valueStyle={{
              fontWeight: "bold",
            }}
            badgeDotColors={[
              "#e76f51",
              "#00b4d8",
              "#e9c46a",
              "#e76f51",
              "#8ac926",
              "#00b4d8",
              "#e9c46a",
            ]}
          />
          {/*>>>>>>>>>>>>>>>>>>>>> Vaccins obligatoires <<<<<<<<<<<<<<<<<<<<<< */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                marginTop: 10,
                fontFamily: "PTSans_700Bold",
                color: "#37663B",
                fontSize: 25,
                borderColor: "#37663B",
                borderWidth: 1,
                borderRadius: 5,
                padding: 5,
              }}
            >
              Profil de {firstnameUser}
            </Text>
            {/* Affiche ce qui est après le '&&' que si au moins un élément des filtres est égal à Vaccin*/}
            {value.find((element) => element === "Vaccin") && (
              <View style={styles.filterView}>
                {/* Affiche ce qui est après le '&&' que si au moins un élément des filtres est égal à Obligatoire*/}
                {value.find((element) => element === "Obligatoire") && (
                  <View>
                    <View style={styles.title}>
                      <Ionicons
                        name="ios-information-circle"
                        size={30}
                        color="#5BAA62"
                        onPress={() => infosModal("Vaccins obligatoires :")}
                      />
                      <Text style={styles.textTitle}>
                        Vaccins obligatoires :
                      </Text>
                    </View>
                    <View style={styles.headrow}>
                      <Text style={styles.textHeadColumn1}>Nom : </Text>
                      <Text style={styles.textHeadColumn2}>État : </Text>
                      <Text style={styles.textHeadColumn3}>Date : </Text>
                    </View>

                    {/* Affiche dynamiquement la liste des vaccins obligatoires  */}
                    {vaccines
                      .filter((element) => element.priority === "Obligatoire")
                      .map((e, index) => (
                        <View style={{ backgroundColor: "#fff" }}>
                          <View style={styles.row} key={index}>
                            <Text
                              style={styles.textRow}
                              onPress={() => launchModal(e.name, e.description)}
                            >
                              {" "}
                              {e.name}
                            </Text>
                            {/* Pour colorer la bordure du dropdown picker */}
                            <Dropdown
                              style={[
                                styles.dropDownPickerState,
                                isFocus1 && { borderColor: "#5BAA62" },
                              ]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              value={e.status}
                              placeholder="À renseigner"
                              labelField="label"
                              valueField="value"
                              maxHeight={165}
                              data={state1}
                              multiple={false} //Permet de sélectionner une seule option
                              // onFocus={() => setIsFocus1(true)}
                              // onBlur={() => setIsFocus1(false)}
                              onChange={(item) => {
                                mandatoryVaccinesStatus(item, index); //Pour mettre à jour le status du soin
                              }}
                            />
                            <View style={{ minWidth: "32%" }}>
                              {/* Le bouton pour afficher le dateTimePicker */}
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => dateModal(e._id, e.status)}
                              >
                                {/* Affiche la date sélectionnée par le user dans le bouton */}
                                <Text style={styles.textDatePicker}>
                                  {new Date(e.endDate).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )}

                {/* >>>>>>>>>>>>>>>>>>>>> Vaccins recommandés <<<<<<<<<<<<<<<<<<<<<< */}

                {/* Affiche le haut du tableau et tout le tableau que si un élément dans les filtres est égal à Recommandé */}
                {value.find((element) => element === "Recommandé") && (
                  <View>
                    <View style={styles.title}>
                      <Ionicons
                        name="ios-information-circle"
                        size={30}
                        color="#5BAA62"
                        onPress={() => infosModal("Vaccins recommandés :")}
                      />
                      <Text style={styles.textTitle}>
                        Vaccins recommandés :
                      </Text>
                    </View>
                    <View style={styles.headrow}>
                      <Text style={styles.textHeadColumn1}>Nom : </Text>
                      <Text style={styles.textHeadColumn2}>État : </Text>
                      <Text style={styles.textHeadColumn3}>Date : </Text>
                    </View>

                    {/* Affiche dynamiquement la liste des vaccins recommandés */}
                    {vaccines
                      .filter((element) => element.priority === "Recommandé")
                      .map((e, index) => (
                        <View style={{ backgroundColor: "#fff" }}>
                          <View style={styles.row}>
                            <Text
                              style={styles.textRow}
                              onPress={() => launchModal(e.name, e.description)}
                            >
                              {" "}
                              {e.name}
                            </Text>
                            {/* Pour colorer la bordure du dropdown picker */}
                            <Dropdown
                              style={[
                                styles.dropDownPickerState,
                                isFocus4 && { borderColor: "#5BAA62" },
                              ]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              value={e.status}
                              placeholder="À renseigner"
                              labelField="label"
                              valueField="value"
                              maxHeight={165}
                              data={state4}
                              multiple={false} //Permet de sélectionner une seule option
                              // onFocus={() => setIsFocus4(true)}
                              // onBlur={() => setIsFocus4(false)}
                              onChange={(item) => {
                                recommendedVaccinesStatus(item, index); //Pour mettre à jour le status du soin
                              }}
                            />
                            <View style={{ minWidth: "32%" }}>
                              {/* Le bouton pour afficher le dateTimePicker */}
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => dateModal(e._id, e.status)}
                              >
                                {/* Affiche la date sélectionnée par le user dans le bouton */}
                                <Text style={styles.textDatePicker}>
                                  {new Date(e.endDate).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            )}

            {/* >>>>>>>>>>>>>>>>>>>>> Examens de santé recommandés <<<<<<<<<<<<<<<<<<<<<< */}

            {/* Affiche ce qui est après '&&' que si au moins élément dans le filtre est égal à Examen de santé */}
            {value.find((element) => element === "Examen de santé") && (
              <View>
                {/* Aaffiche le haut du tableau et tout le tableau que si un élément des filtres est égal à Obligatoire */}
                {value.find((element) => element === "Obligatoire") && (
                  <View>
                    <View style={styles.title}>
                      <Ionicons
                        name="ios-information-circle"
                        size={30}
                        color="#5BAA62"
                        onPress={() =>
                          infosModal("Examens de santé obligatoires :")
                        }
                      />
                      <Text style={styles.textTitle}>
                        Examens de santé obligatoires :
                      </Text>
                    </View>

                    <View style={styles.headrow}>
                      <Text style={styles.textHeadColumn1}>Nom : </Text>
                      <Text style={styles.textHeadColumn2}>État : </Text>
                      <Text style={styles.textHeadColumn3}>Date : </Text>
                    </View>
                    {/* Affiche dynamiquement la liste des examens qui sont obligatoires uniquement */}
                    {medicalTests
                      .filter((element) => element.priority === "Obligatoire")
                      .map((e, index) => (
                        <View style={{ backgroundColor: "#fff" }}>
                          <View style={styles.row}>
                            <Text
                              style={styles.textRow}
                              onPress={() => launchModal(e.name, e.description)}
                            >
                              {e.name}
                            </Text>
                            <Dropdown
                              style={[
                                styles.dropDownPickerState,
                                isFocus7 && { borderColor: "#5BAA62" },
                              ]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              value={e.status}
                              placeholder="À renseigner"
                              labelField="label"
                              valueField="value"
                              maxHeight={165}
                              data={state7}
                              multiple={false} //Permet de sélectionner une seule option
                              // onFocus={() => setIsFocus7(true)}
                              // onBlur={() => setIsFocus7(false)}
                              onChange={(item) => {
                                mandatoryExamsStatus(item, index); //Pour mettre à jour le status du soin
                              }}
                            />
                            <View style={{ minWidth: "32%" }}>
                              {/* Le bouton pour afficher le dateTimePicker */}
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => dateModal(e._id, e.status)}
                              >
                                {/* Affiche la date sélectionnée par le user dans le bouton */}
                                <Text style={styles.textDatePicker}>
                                  {new Date(e.endDate).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )}

                {/* Affiche le tableau que si  il y a un élément des filtres égal á Recommandé*/}
                {value.find((element) => element === "Recommandé") && (
                  <View>
                    <View style={styles.title}>
                      <Ionicons
                        name="ios-information-circle"
                        size={30}
                        color="#5BAA62"
                        onPress={() =>
                          infosModal("Examens de santé recommandés :")
                        }
                      />
                      <Text style={styles.textTitle}>
                        Examens de santé recommandés :
                      </Text>
                    </View>

                    <View style={styles.headrow}>
                      <Text style={styles.textHeadColumn1}>Nom : </Text>
                      <Text style={styles.textHeadColumn2}>État : </Text>
                      <Text style={styles.textHeadColumn3}>Date : </Text>
                    </View>
                    {/* Affiche dynamiquement la liste des examens qui sont recommandés uniquement */}
                    {medicalTests
                      .filter((element) => element.priority === "Recommandé")
                      .map((e, index) => (
                        <View style={{ backgroundColor: "#fff" }}>
                          <View style={styles.row}>
                            <Text
                              style={styles.textRow}
                              onPress={() => launchModal(e.name, e.description)}
                            >
                              {e.name}
                            </Text>
                            <Dropdown
                              style={[
                                styles.dropDownPickerState,
                                isFocus6 && { borderColor: "#5BAA62" },
                              ]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              value={value6}
                              placeholder="À renseigner"
                              labelField="label"
                              valueField="value"
                              maxHeight={165}
                              data={state6}
                              multiple={false} //Permet de sélectionner une seule option
                              // onFocus={() => setIsFocus6(true)}
                              // onBlur={() => setIsFocus6(false)}
                              onChange={(item) => {
                                recommendedExamsStatus(item, index); //Pour mettre à jour le status du soin
                              }}
                            />
                            <View style={{ minWidth: "32%" }}>
                              {/* Le bouton pour afficher le dateTimePicker */}
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => dateModal(e._id, e.status)}
                              >
                                {/* Affiche la date sélectionnée par le user dans le bouton */}
                                <Text style={styles.textDatePicker}>
                                  {new Date(e.endDate).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            )}

            {/*>>>>>>>>>>>>>>>>>>>>> Vaccins/Examens projets personnels <<<<<<<<<<<<<<<<<<<<<< */}
            {value.find(
              (element) => element === "Vaccin" || element === "Examen de santé"
            ) && (
                <View style={styles.title}>
                  <Ionicons
                    name="ios-information-circle"
                    size={30}
                    color="#5BAA62"
                    onPress={() => infosModal("Besoins personnels :")}
                  />
                  <Text style={styles.textTitle}>Besoins personnels :</Text>
                </View>
              )}

            {/*>>>>>>>>>>>>>>>>>>>>> Ajouter un vaccin/un examen <<<<<<<<<<<<<<<<<<<<<< */}

            {/* Ajout d'une ligne quand le user clic sur l'icône + */}
            <View>{healthCarePerso}</View>
            {value.find(
              (element) =>
                element === "Vaccin" ||
                (element === "Examen de santé" && element === "Personnel")
            ) && (
                <View style={styles.subTitle}>
                  <AntDesign
                    name="pluscircle"
                    size={24}
                    color="#5BAA62"
                    onPress={() => {
                      addHealthCare();
                    }}
                  />
                  <Text style={styles.text}>Ajouter un vaccin ou un examen </Text>
                </View>
              )}

            {/*>>>>>>>>>>>>>>>>>>>>> Préparer un voyage <<<<<<<<<<<<<<<<<<<<<< */}
            {/* Redirecttion vers site Pasteur au clic sur globe et sur le texte (au choix) */}
            <View style={styles.subTitle}>
              <Entypo
                name="globe"
                size={24}
                color="#5BAA62"
                onPress={() => {
                  Linking.openURL(
                    "https://www.pasteur.fr/fr/centre-medical/preparer-son-voyage?emkfid=EMF-22701181460-k--77618669180--s&gclid=EAIaIQobChMIzcO_oLvS9wIVRajVCh2S5ANiEAAYASAAEgLNrvD_BwE"
                  );
                }}
              />
              <Text
                style={styles.text}
                onPress={() => {
                  Linking.openURL(
                    "https://www.pasteur.fr/fr/centre-medical/preparer-son-voyage?emkfid=EMF-22701181460-k--77618669180--s&gclid=EAIaIQobChMIzcO_oLvS9wIVRajVCh2S5ANiEAAYASAAEgLNrvD_BwE"
                  );
                }}
              >
                Préparer un voyage{" "}
              </Text>
            </View>

            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LES MODALS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
            {/*>>>>>>>>>>>>>>>>>>>>> Modal d'infos de vaccin et d'examen <<<<<<<<<<<<<<<<<<<<<< */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {info.map((info, i) => {
                return (
                  <ModalInfos visible={modalInfosVisible} key={i}>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.header}>
                        <TouchableOpacity
                          onPress={() => setModalInfosVisible(false)}
                        ></TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.title}>
                      <Ionicons
                        name="ios-information-circle"
                        size={30}
                        color="#FFFFFF"
                        onPress={() => setModalInfosVisible(true)}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#FFFFFF",
                          paddingLeft: 9,
                        }}
                        h4
                      >
                        {name}
                      </Text>
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          marginVertical: 30,
                          fontSize: 17,
                          textAlign: "center",
                          color: "#FFFFFF",
                        }}
                      >
                        {description}
                      </Text>
                      <Button
                        title="OK"
                        buttonStyle={styles.buttonModal}
                        onPress={() => setModalInfosVisible(false)}
                      />
                    </View>
                  </ModalInfos>
                );
              })}
            </View>
          </View>

          {/*>>>>>>>>>>>>>>>>>>>>> Modal dateTimePicker des vaccines <<<<<<<<<<<<<<<<<<<<<< */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ModalInfos visible={modalDate}>
              <Text onPress={() => changeStateVaccines()}>Fermer</Text>
              <DateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"} //Version du dateTimePicker adapté aux versions androïd(default) et ios
                value={tempState.date || new Date()}
                minimumDate={new Date(Date.now())}
                // minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
                onChange={(event, lastDate) => changeTempDate(lastDate)}
                onConfirm={setDate}
                onCancel={hideDatePicker}
              />
            </ModalInfos>
          </View>

          {/*>>>>>>>>>>>>>>>>>>>>> Modal dateTimePicker des examens <<<<<<<<<<<<<<<<<<<<<< */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ModalInfos visible={modalDate}>
              <Text onPress={() => changeStateExams()}>Fermer</Text>
              <DateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"} //Version du dateTimePicker adapté aux versions androïd(default) et ios
                value={tempState.date || new Date()}
                minimumDate={new Date(Date.now())}
                // minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
                onChange={(event, lastDate) => changeTempDate(lastDate)}
                onConfirm={setDate}
                onCancel={hideDatePicker}
              />
            </ModalInfos>
          </View>

          {/*>>>>>>>>>>>>>>>>>>>>> Modal dateTimePicker des besoins personnels <<<<<<<<<<<<<<<<<<<<<< */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ModalInfos visible={modalDate}>
              <Text onPress={() => changeStateHealthCarePerso()}>Fermer</Text>
              <DateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"} //Version du dateTimePicker adapté aux versions androïd(default) et ios
                value={tempState.date || new Date()}
                minimumDate={new Date(Date.now())}
                // minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
                onChange={(event, lastDate) => changeTempDate(lastDate)}
                onConfirm={setDate}
                onCancel={hideDatePicker}
              />
            </ModalInfos>
          </View>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ModalInfos visible={modalDate8}>
              <Text onPress={() => setModalDate8(false)}>fermer</Text>
              <DateTimePicker
                mode="date"
                style={{
                  backgroundColor: "#FFF",
                }}
                display={Platform.OS === "ios" ? "spinner" : "default"} //Version du dateTimePicker adapté aux versions androïd(default) et ios
                value={date8}
                minimumDate={new Date(Date.now())}
                // minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
                onChange={onChange8}
                onConfirm={handleDatePicker}
                onCancel={hideDatePicker}
              />
            </ModalInfos>
          </View>

          {/* Je map sur definitionList pour dynamiser les modals de définition */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ModalInfos visible={modalDefVisible}>
              <ScrollView>
                <View style={{ alignItems: "center" }}>
                  <View style={styles.header}>
                    <TouchableOpacity
                      onPress={() => setModalDefVisible(false)}
                    ></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.title}>
                  <Ionicons
                    name="ios-information-circle"
                    size={30}
                    color="#FFFFFF"
                    onPress={() => setModalDefVisible(true)}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#FFFFFF",
                      paddingLeft: 9,
                    }}
                    h4
                  >
                    {name} :
                  </Text>
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      marginVertical: 30,
                      fontSize: 17,
                      textAlign: "center",
                      color: "#FFFFFF",
                    }}
                  >
                    {description}
                  </Text>
                  <Button
                    title="OK"
                    buttonStyle={styles.buttonModal}
                    onPress={() => setModalDefVisible(false)}
                  />
                </View>
              </ScrollView>
            </ModalInfos>
          </View>
        </View>
      </ScrollView>
    );
  }
}
// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STYLES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
const styles = StyleSheet.create({
  button: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#EBFAD5",
    fontFamily: "PTSans_400Regular",
  },
  buttonPerso: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBFAD5",
    fontFamily: "PTSans_400Regular",
  },
  buttonModal: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    size: "md",
    backgroundColor: "#37663B",
    width: 100,
    height: 40,
    margin: 15,
    fontFamily: "PTSans_400Regular",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#EBFAD5",
    minHeight: "100%",
  },
  DropDownPicker: {
    borderColor: "#37663B",
    marginTop: 45,
    fontFamily: "PTSans_400Regular",
  },
  dropDownPickerState: {
    height: 30,
    minWidth: "41%",
    borderRadius: 0,
    borderColor: "#EBFAD5",
    borderWidth: 0.5,
    paddingHorizontal: 10,
    fontFamily: "PTSans_400Regular",
  },
  dropDownPickerVaccines: {
    height: 30,
    minWidth: "28%",
    borderRadius: 0,
    borderColor: "#EBFAD5",
    paddingLeft: 5,
    borderWidth: 0.5,
    fontFamily: "PTSans_400Regular",
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
    fontFamily: "PTSans_400Regular",
  },
  headrow: {
    flexDirection: "row",
    display: "flex",
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
  placeholderStyle: {
    fontSize: 13,
    fontFamily: "PTSans_400Regular",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowPerso: {
    flexDirection: "row",
  },
  selectedTextStyle: {
    fontSize: 13,
  },
  subTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 9,
    color: "#37663B",
    width: 350,
    fontFamily: "PTSans_400Regular",
  },
  text: {
    color: "#37663B",
    marginLeft: 10, //Espace entre texte et icône
    fontFamily: "PTSans_400Regular",
  },
  textDatePicker: {
    alignContent: "center",
    borderColor: "#EBFAD5",
    fontFamily: "PTSans_400Regular",
  },
  textHeadColumn1: {
    flexDirection: "row",
    backgroundColor: "#5BAA62",
    borderColor: "#37663B",
    width: "30%",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBFAD5",
    paddingLeft: 5,
    fontFamily: "PTSans_400Regular",
  },
  textHeadColumn2: {
    flexDirection: "row",
    backgroundColor: "#5BAA62",
    borderColor: "#37663B",
    width: "41%",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBFAD5",
    paddingLeft: 5,
    fontFamily: "PTSans_400Regular",
  },
  textHeadColumn3: {
    flexDirection: "row",
    backgroundColor: "#5BAA62",
    borderColor: "#5BAA62",
    width: "29.5%",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBFAD5",
    paddingLeft: 5,
    fontFamily: "PTSans_400Regular",
  },
  textRow: {
    height: 30,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
    paddingTop: 3,
    borderWidth: 1,
    borderColor: "#EBFAD5",
    fontFamily: "PTSans_400Regular",
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "#37663B",
    marginLeft: 10, //Espace entre texte et icône
    fontFamily: "PTSans_700Bold",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    padding: 9,
    color: "#37663B",
    width: 350,
    fontFamily: "PTSans_400Regular",
  },
  filterView: {
    flexDirection: "column",
    alignItems: "center",
    padding: 9,
    color: "#37663B",
  },
});

// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REDUX <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
function mapStateToProps(state) {
  return { newHealthCare: state.newHealthCare, token: state.token };
}

function mapDispatchToProps(dispatch) {
  return {
    addToProfil: function (newHealthCare) {
      dispatch({ type: "addHealthCare", healthCare: newHealthCare });
    },
    deleteToProfil: function (newHealthCare) {
      dispatch({
        type: "deleteHealthCare",
        healthCare: newHealthCare,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilScreen);
