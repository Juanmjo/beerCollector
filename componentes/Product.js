import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { database } from "../firebase-config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

export default function Product({ id, image, name, description }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDescription, setEditedDescription] = useState(description);
  const [error, setError] = useState(false); // Nuevo estado para el error del título

  const onDelete = () => {
    Alert.alert(
      "Delete Product",
      "¿Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteProduct },
      ]
    );
  };

  const deleteProduct = async () => {
    const docRef = doc(database, "products", id);
    await deleteDoc(docRef);
  };

  const onEdit = async () => {
    if (isEditing) {
      // Validar el título antes de guardar los cambios
      if (editedName.trim() === "") {
        setError(true);
        Alert.alert("Error", "Please enter a title");
        return;
      }

      // Guardar los cambios en la base de datos
      const docRef = doc(database, "products", id);
      const updatedProduct = {
        name: editedName,
        description: editedDescription,
      };
      await updateDoc(docRef, updatedProduct);

      // Salir del modo de edición y restablecer el estado de error
      setIsEditing(false);
      setError(false);
    } else {
      // Entrar en el modo de edición
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.productContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          {isEditing ? (
            <View>
              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                style={styles.editInput}
              />
              <TextInput
                value={editedDescription}
                onChangeText={setEditedDescription}
                style={styles.editInput}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.nameProduct}>{name}</Text>
              <Text style={styles.descriptionProduct}>{description}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.button}>
          <AntDesign name={isEditing ? "check" : "edit"} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.button}>
          <AntDesign name="delete" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
  },

  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  imageContainer: {
    width: "50%",
    height: 130,
  },

  image: {
    flex: 1,
    borderRadius: 10,
  },

  textContainer: {
    flex: 1,
    paddingLeft: 16,
  },

  nameProduct: {
    fontSize: 20,
    fontWeight: "bold",
  },

  descriptionProduct: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },

  editInput: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  button: {
    marginHorizontal: 70,
  },
});
