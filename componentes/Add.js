import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { database } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Add() {
  const navigation = useNavigation();

  const [newItem, setNewItem] = useState({
    image: null,
    name: "",
    description: "",
    createdAt: new Date(),
  });

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    Alert.alert(
      "Select Image",
      "Choose an option:",
      [
        {
          text: "Camera",
          onPress: () => launchCamera(),
        },
        {
          text: "Gallery",
          onPress: () => launchImageLibrary(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const launchCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  const launchImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  const onSend = async () => {
    await addDoc(collection(database, "products"), newItem);
    navigation.goBack();
  };

  return (
    <View style={{ backgroundColor: "#F5F3F9" }}>
      <Text style={styles.title}>New Product</Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={selectImage} style={styles.button}>
          <Text style={styles.buttonText}>SELECT IMAGE</Text>
        </TouchableOpacity>
        {newItem.image && (
          <Image source={{ uri: newItem.image }} style={styles.image} />
        )}
        <TextInput
          onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          placeholder="Product name"
          style={styles.textInput}
        />
        <TextInput
          onChangeText={(text) => setNewItem({ ...newItem, description: text })}
          placeholder="Description"
          style={styles.textInput}
        />
        <TouchableOpacity onPress={onSend} style={styles.button}>
          <Text style={styles.buttonText}>CREATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 10,
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

  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 16,
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
