// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> IMPORT DES DIFFERENTES LIBRAIRIES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Button, Input, Card, ListItem, Icon } from "react-native-elements";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";
// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FONCTION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //

function AddressBookScreen(props) {
  //Variable qui permet de stocker les établissements de santé ajoutés en favoris (liés à la BDD)
  const [addresses, SetAddresses] = useState([]);

  useEffect(() => {
    //Fonction qui permet de faire la liaison entre le Backend (et la BDD) pour récupérer le carnet d'adresse des users
    async function readBDD() {
      let responseBDD = await fetch(
        `https://life-yourapp.herokuapp.com/readhcpro/${props.token}`,
        {
          method: "GET",
        }
      );
      //Variable qui permet d'exploiter les données BDD
      let response = await responseBDD.json();
      //Set les données dans le tableau addresses
      SetAddresses(response.addB);
    }
    readBDD();
  }, []);

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
        Mon carnet d'adresses
      </Text>
      <ScrollView>
        {addresses.map((u, i) => {
          return (
            <View>
              <Card
                containerStyle={{
                  backgroundColor: "#FFFF",
                  borderWidth: 0,
                  elevation: 5,
                  borderRadius: 20,
                  paddingLeft: 30,
                  borderLeftWidth: 4,
                  borderColor: "#5BAA62",
                }}
              >
                <Card.Title style={{ textAlign: "auto", marginBottom: 5 }}>
                  <View>
                    <Entypo color="#5BAA62" name="leaf" size={18} />
                  </View>
                  <View>
                    <Text style={styles.title}>{u.profession}</Text>
                  </View>
                </Card.Title>
                <View key={Math.random()}>
                  <Text style={styles.a}>{u.category}</Text>
                  <View
                    style={{
                      paddingTop: 8,
                      paddingBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        textAlign: "center",
                        paddingBottom: 4,
                      }}
                    >
                      <FontAwesome5
                        name="map-marker-alt"
                        size={14}
                        color="#5BAA62"
                      />
                      <Text style={{ fontSize: 12, marginLeft: 8 }}>
                        {capsF(u.adresse)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        textAlign: "center",
                      }}
                    >
                      <FontAwesome5
                        name="phone-alt"
                        size={14}
                        color="#5BAA62"
                      />
                      <Text style={{ fontSize: 12, marginLeft: 8 }}>
                        {u.tel}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, fontStyle: "italic" }}>
                    {u.secteur}
                  </Text>
                </View>
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STYLES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#EBFAD5",
  },
  title: {
    color: "#5BAA62",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 14,
    marginLeft: 19,
  },
  a: {
    fontWeight: "bold",
    fontSize: 13,
  },
});

function mapStateToProps(state) {
  return { token: state.token };
}
export default connect(mapStateToProps, null)(AddressBookScreen);
