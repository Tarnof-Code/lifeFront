import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { connect } from "react-redux";
import { TextInput } from "react-native-paper";

function AddProfileScreen(props) {
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
        { label: "Aucune", value: "Aucune" },
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

    //DropDownPicker lien de parenté
    const [open5, setOpen5] = useState(false);
    const [value5, setValue5] = useState(null);
    const [relationList, setRelationList] = useState([
        { label: "😤 Belle-mère", value: "Belle-mère" },
        { label: "Enfant", value: "Enfant" },
        { label: "Parent", value: "Parent" },
        { label: "🚀 Assistant Teacher", value: "Assistant Teacher" },
        { label: "Conjoint.e", value: "Conjoint.e" },
        { label: "❤️ Crush Demo Day", value: "Crush Demo Day" },
        { label: "Autre", value: "Autre" },
    ]);

    //DropDownPicker nouveau profil ou connecter
    const [open6, setOpen6] = useState(false);
    const [value6, setValue6] = useState(null);
    const [choicesList, setChoicesList] = useState([
        { label: "Nouveau Profil", value: "Nouveau Profil" },
        { label: "Connecter un compte", value: "Connecter un compte" },
    ]);


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [sexe, setSexe] = useState("");
    const [profession, setProfession] = useState("");
    const [illnesses, setIllnesses] = useState([]);
    const [familyHistory, setFamilyHistory] = useState([]);
    const [relationship, SetRelationship] = useState("");
    const [choice, setChoice] = useState("");
    const [profilsList, setProfilsList] = useState([])
    const [msg, setMsg] = useState([]);


    useEffect(() => {
        async function readBDD() {
            let responseBDD = await fetch(
                `https://life-yourapp.herokuapp.com/profil/${props.token}`,
                {
                    method: "GET",
                }
            );

            let response = await responseBDD.json();

            let temp = []
            for (let i = 0; i < response.userFamily.family.length; i++) {
                temp.push(`${response.userFamily.family[i].firstname} ${response.userFamily.family[i].lastname} connecté ${"\n"}`)
            }

            setProfilsList([temp]);
        }
        readBDD();
    }, []);

    var handleAddProfile = (
        firstName,
        lastName,
        email,
        birthdate,
        sexe,
        profession,
        illnesses,
        familyHistory,
        relationship
    ) => {
        async function addProfile() {

            let rawRecUser = await fetch(
                `https://life-yourapp.herokuapp.com/add-profile/${props.token}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `emailFromFront=${email}&firstnameFromFront=${firstName}&lastnameFromFront=${lastName}&birthdateFromFront=${birthdate}&sexFromFront=${sexe}&professionFromFront=${profession}&illnessesFromFront=${illnesses}&familyHistoryFromFront=${familyHistory}&relationshipFromFront=${relationship}`,
                }
            );
            var recUser = await rawRecUser.json();

            if (recUser.user) {
                setMsg([...msg, `${email} En attente de validation`]);
                setEmail("");
            }
        }

        addProfile();
    };


    let listMsg = msg.map((e, i) => (<Text style={{ textAlign: "center", marginBottom: 30 }} key={i}>{e}</Text>))
    let listProfilsConnected = profilsList.map((e, i) => (<Text style={{ textAlign: "center" }} key={i}>{e}</Text>))

    return (
        <View>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ marginTop: 60 }}>
                        <DropDownPicker
                            listMode="SCROLLVIEW"
                            style={styles.dropDownPicker}
                            dropDownContainerStyle={{ width: 300 }}
                            open={open6}
                            value={value6}
                            items={choicesList}
                            setOpen={setOpen6}
                            setValue={setValue6}
                            setItems={setChoicesList}
                            placeholder="Sélectionnez"
                            placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
                            onChangeValue={(value) => {
                                setChoice(value);
                            }}
                        />
                    </View>
                    {choice === "Connecter un compte" && (
                        <View style={{ marginTop: 30 }}>
                            <TextInput
                                icon="key"
                                style={styles.input}
                                placeholder="Email"
                                autoCorrect={false}
                                underlineColorAndroid="transparent"
                                placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
                                value={email}
                                onChangeText={(value) => setEmail(value)}
                            />
                        </View>
                    )}
                    {choice === "Nouveau Profil" && (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 30,
                            }}
                        >
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
                                labelStyle={{ fontStyle: "bold" }}
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
                                setItems={setJob}
                                onChangeValue={(value) => {
                                    setProfession(value);
                                }}
                                placeholder="Catégorie professionnelle"
                                placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
                            />

                            <DropDownPicker
                                listMode="SCROLLVIEW"
                                style={styles.dropDownPicker}
                                dropDownContainerStyle={{ width: 300 }}
                                open={open5}
                                value={value5}
                                items={relationList}
                                setOpen={setOpen5}
                                setValue={setValue5}
                                setItems={setRelationList}
                                onChangeValue={(value) => {
                                    SetRelationship(value);
                                }}
                                placeholder="Lien de parenté"
                                placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
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
                                dropDownDirection="TOP"
                                dropDownContainerStyle={{ width: 300 }}
                                open={open3}
                                value={value3}
                                items={pathos}
                                setOpen={setOpen3}
                                setValue={setValue3}
                                setItems={setPathos}
                                onChangeValue={(value) => {
                                    setIllnesses(value);
                                }}
                                placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
                                placeholder="Pathologies"
                                theme="LIGHT"
                                multiple={true} //Permet de sélectionner plusieurs options
                                min={0}
                                mode="BADGE"
                                valueStyle={{ fontWeight: "bold" }}
                            />
                            <DropDownPicker
                                listMode="SCROLLVIEW"
                                style={styles.dropDownPicker}
                                dropDownDirection="TOP"
                                dropDownContainerStyle={{ width: 300 }}
                                open={open4}
                                value={value4}
                                items={ante}
                                setOpen={setOpen4}
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
                                placeholderStyle={{ color: "#576574", fontStyle: "italic" }}
                            />
                        </View>
                    )}
                    <Button
                        buttonStyle={styles.smallButton}
                        title="Valider"
                        onPress={
                            () =>
                                handleAddProfile(
                                    firstName,
                                    lastName,
                                    email,
                                    birthdate,
                                    sexe,
                                    profession,
                                    illnesses,
                                    familyHistory,
                                    relationship
                                )
                        }
                    />
                    {listProfilsConnected}
                    {listMsg}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBFAD5",
        alignItems: "center",
        minHeight: Dimensions.get("window").height + 40,
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
        borderRadius: 50,
        height: 50,
        width: 150,
        marginBottom: 10,
        marginTop: 10,
    },
});
function mapDispatchToProps(dispatch) {
    return {
        tokenStore: function (token) {
            dispatch({ type: "addToken", token: token });
        },
    };
}
function mapStateToProps(state) {
    return { token: state.token };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProfileScreen);
