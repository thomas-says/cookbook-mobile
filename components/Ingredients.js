import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { Card, Divider, Icon } from 'react-native-elements';
import firebase from '../firebase';


export default class Ingredients extends React.Component  {
    
    state = {
        recette: this.props.recette
    }

    handlePersonnes = (number) => {
        const {ingredients, nb_personnes} = this.state.recette; 
        const newIngredients = [];

        if(nb_personnes+number < 1) return; 
       
        ingredients.forEach(ingredient => {
            ingredient.quantite = (nb_personnes+number)*ingredient.quantite/nb_personnes;
            newIngredients.push(ingredient); 
        })
       
        this.setState(prevState => ({
            recette: {
                ...prevState.recette,
                nb_personnes: prevState.recette.nb_personnes + number, 
                ingredients: newIngredients
            }
        }))
    }

    handleAddCart = (ingredient) => {
        this.addToCart(ingredient); 
    }

    addToCart = (ingredient) => {
        const db = firebase.firestore();
        ingredient.quantite = Math.ceil(ingredient.quantite);
        db.collection("panier").add(ingredient)
        .then(function () {
            ToastAndroid.show(`L'ingrédient ${ingredient.name} a été ajouté au panier`, ToastAndroid.LONG);
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }
    
    render() {
        const {recette} = this.state;
        return (
            <Card title="Ingrédients">
                <View key="nb_pers" style={styles.nbPersContainer}>
                    <TouchableOpacity style={styles.toAddCart} onPress={() => this.handlePersonnes(-1)}>
                        <Icon style={styles.icon} name="minus-circle" type="font-awesome" />
                    </TouchableOpacity>
                    <Text>Pour {recette.nb_personnes} personne(s)</Text>
                    <TouchableOpacity style={styles.toAddCart} onPress={() => this.handlePersonnes(1)}>
                        <Icon style={styles.icon} name="plus-circle" type="font-awesome" />
                    </TouchableOpacity>
                </View>
                <Divider /> 
                {recette.ingredients.map((ingredient, i, ingredients) => {
                    return (
                        <View key={i} style={styles.ingredientContainer}>
                            <Text >{ingredient.name} : {Math.ceil(ingredient.quantite)} {ingredient.unite == "pièce" ? "" : ingredient.unite} </Text>
                            <TouchableOpacity style={styles.toAddCart} onPress={() => this.handleAddCart(ingredient)}>
                                      <Icon style={styles.icon} name="cart-arrow-down" type="font-awesome" />
                            </TouchableOpacity>
                            
                            {i < ingredients.length- 1 && <Divider />}
                        </View>
                    );
                })}
            </Card>
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
    icon: {
        height: 20, 
        margin: 50
    } , 
    toAddCart: {
        marginBottom: 10,
    }
})