import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Text, ScrollView, View, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import {Card, Icon , Divider} from 'react-native-elements'; 
import { NavigationEvents } from 'react-navigation';
import firebase from '../firebase'

import EnTete from '../components/EnTete'

export default class CartScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    panier: [], 
    isLoading: true,
  }

  componentDidMount() {
    this.getData(); 
  }

  async getData() {
    const panier = await this.getPanier(); 
    this.setState({panier: panier, isLoading: false}); 
  }

  async getPanier() {
        const snapshot = await firebase.firestore().collection('panier').get()
        panier = snapshot.docs.map(doc => {
            const id = doc.id;
            const data = doc.data()
            return ({ id, ...data })
        });
        return panier;
  }

  handleDelete = (id) => {
    console.log(id);
    firebase.firestore().collection("panier").doc(id).delete().then(() => {
      ToastAndroid.show("Ingrédient supprimé du panier", ToastAndroid.LONG);
      this.getData()
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
  }

  render() {
    const {isLoading, panier} = this.state; 
    return  (
      <View>
         <NavigationEvents
            onDidFocus={() => this.getData()}
          />
        <EnTete/>
        <ScrollView style={{marginTop: 120}}>
        {!isLoading ?
         <Card title="Votre liste de course">
         {panier.length > 0 ? panier.map((ingredient, i, ingredients) => {
             return (
                 <View key={i} style={styles.ingredientContainer}>
                     <Text style={styles.textIngredient}>{ingredient.name} : {Math.ceil(ingredient.quantite)} {ingredient.unite == "pièce" ? "" : ingredient.unite} </Text>
                     <TouchableOpacity style={styles.toAddCart} onPress={() => this.handleDelete(ingredient.id)}>
                               <Icon style={styles.icon} name="trash" type="font-awesome"  />
                     </TouchableOpacity>
                     
                     {i < panier.length- 1 && <Divider />}
                 </View>
             );
         }): 
          <Text>Votre panier est vide. Vous pouvez ajouter des ingrédients depuis une recette</Text>
         }
     </Card>
        : 

        <Text>Loading...</Text> 

        }
        </ScrollView>
      </View>
      
        

    );
  }
}

const styles = StyleSheet.create({
  nbPersContainer: {
      flex: 1, 
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 15, 
  }, 
  ingredientContainer: {
      flex: 1, 
      flexDirection: 'row',
      alignItems: 'center', 
      padding: 15, 
  },
  textIngredient: {
    fontSize: 15,
  },
  icon: {
      height: 20, 
      margin: 50
  } , 
  toAddCart: {
      marginBottom: 10,
  }
})
