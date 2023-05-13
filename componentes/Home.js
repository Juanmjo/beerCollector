import React from "react";
import { Text, Button, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database } from "../firebase-config";
import {
  QuerySnapshot,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Product from "./Product";
import { useState } from "react";
import { useEffect } from "react";
import { useLayoutEffect } from "react";

export default function Home() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add"
          onPress={() => navigation.navigate("Add")}
          color="#000000"
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const collectionRef = collection(database, "products");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsuscribe = onSnapshot(q, (QuerySnapshot) => {
      setProducts(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          image: doc.data().image,
          name: doc.data().name,
          description: doc.data().description,
          createdAt: doc.data().createdAt,
        }))
      );
    });
    return unsuscribe;
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Products</Text>
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3F9",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 10,
  },
});
