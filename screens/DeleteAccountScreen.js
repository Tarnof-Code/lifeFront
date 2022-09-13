// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> IMPORT DES DIFFERENTES LIBRAIRIES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

// *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FONCTION <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
function DeleteAccountScreen(props) {
  // *<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SIGN-UP >>>>>>>>>>>>>>>>>>>>>>>>>>*
  const signUp = async () => {
    props.navigation.navigate("SignUpInfoScreen", {
      screen: "SignUpInfoScreen",
    });
  };

  // *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RETURN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<* //
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Votre compte a bien été supprimé.</Text>
      <Button
        type="solid"
        buttonStyle={styles.button}
        title="Recréer un compte "
        onPress={() => signUp()}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    backgroundColor: "#5BAA62",
    width: 300,
    height: 100,
    margin: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBFAD5",
  },
  text: {
    fontSize: 50,
  },
});

export default DeleteAccountScreen;
