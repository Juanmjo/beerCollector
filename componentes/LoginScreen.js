import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase-config";
import SvgTop from "./SvgTopLogin";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navegation = useNavigation();

  const data = initializeApp(firebaseConfig);
  const auth = getAuth(data);

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Cuenta creada!");
        const user = userCredential.user;
        console.log(user);
        Alert.alert("Cuenta creada exitosamente!");
        navegation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Sesion iniciada!");
        const user = userCredential.user;
        console.log(user);
        navegation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerSVG}>
        <SvgTop />
      </View>
      <Text style={styles.title}>Beer Collector</Text>
      <Text style={styles.subTitle}>Sign in to your account</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
        placeholder="Email"
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>SING IN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCreateAccount}>
        <Text style={styles.createAccount}>Don't have an account ?</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
  },

  containerSVG: {
    justifyContent: "flex-start",
    alignItems: "center",
  },

  title: {
    fontSize: 40,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    color: "#808080",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#000000",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  createAccount: {
    fontSize: 14,
    color: "#808080",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
