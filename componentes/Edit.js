import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { database } from "../firebase-config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

function Edit({ id, name, description, onSave }) {
  const [editedName, setEditedName] = useState(name);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = async () => {
    const docRef = doc(database, "products", id);
    const updatedProduct = {
      name: editedName,
      description: editedDescription,
    };
    await updateDoc(docRef, updatedProduct);
    onSave();
  };

  return (
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
      <TouchableOpacity style={styles.editButton} onPress={handleSave}>
        <AntDesign name="check" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export default function Product({ id, image, name, description }) {
  const [isEditing, setIsEditing] = useState(false);

  const onDelete = () => {
    const docRef = doc(database, "products", id);
    deleteDoc(docRef);
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
  };

  const onSaveEdit = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.productContainer}>
      <View style={styles.buttonDelete}>
        <Image source={{ uri: image }} style={styles.image} />
        <TouchableOpacity onPress={onDelete}>
          <AntDesign name="delete" size={24} />
        </TouchableOpacity>
      </View>
      {isEditing ? (
        <Edit
          id={id}
          name={name}
          description={description}
          onSave={onSaveEdit}
        />
      ) : (
        <View>
          <Text style={styles.nameProduct}>{name}</Text>
          <Text style={styles.descriptionProduct}>{description}</Text>
        </View>
      )}
      {!isEditing && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <AntDesign name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    padding: 16,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  nameProduct: {
    fontSize: 32,
    fontWeight: "bold",
  },

  descriptionProduct: {
    fontSize: 24,
    fontWeight: "bold",
    color: "gray",
  },

  buttonDelete: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  editButton: {
    backgroundColor: "#0FA5E9",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },

  editInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
});
