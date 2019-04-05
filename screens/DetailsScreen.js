import React from 'react';
import {Text, TouchableOpacity,  StyleSheet, ScrollView, View} from 'react-native';
import { ExpoConfigView } from '@expo/samples';

import {Tile, Icon, Card} from 'react-native-elements';
import Star from 'react-native-star-view'; 
import GeneralInformation from '../components/GeneralInformationCard'
import Ingredients from '../components/Ingredients'

import firebase from '../firebase';

export default class DetailsScreen extends React.Component {
    static navigationOptions = {
        title : 'Details de recette',
    };

    state = {
        idRecette: (this.getParams()).idRecette, 
        currentRecette: {}, 
        isLoading: true, 
    }

    getParams() {
        return this.props.navigation.state.params || {};
    }

    getRecette() {
        let {idRecette} = this.state; 
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('recettes').doc(idRecette).get().then(function(doc) {
                resolve(doc.data())
            }).catch(function(error) {
                console.log("Error getting document:", error);
            })
        }) 
        
    }

    async loadData() {
        const recette = await this.getRecette(); 
        this.setState({currentRecette: recette, isLoading: false})
    }

    componentDidMount() {
        this.loadData();     
    }

    toggleFavorite = (id) => {
        let {currentRecette} = this.state; 
        currentRecette.est_favoris = !currentRecette.est_favoris;  
        return new Promise((resolve, reject) => {
            firebase.firestore().collection("recettes").doc(id).set({
                id, 
                ...currentRecette,
            })
            .then(function() {
                resolve(); 
            })
            .catch(function(error) {
                reject(error);
            });
        })
    }
    

    handlePress = () => {
        this.toggleFavorite(this.state.idRecette); 
        this.loadData(); 
    }


    render() {
        const {isLoading, currentRecette} = this.state; 
        if (!isLoading){
            return (
                <ScrollView>
                    <Tile
                        imageSrc={{uri: currentRecette.imageUrl}}
                        title={currentRecette.nom}
                        featured
                        caption={"Type :" + currentRecette.type}
                    />
                     <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.handlePress()}
                    >
                        <Icon name={currentRecette.est_favoris ? 'delete' : 'heart'} color='white' type='antdesign'/>
                        <Text style={{color: 'white', marginLeft: 10}}>{currentRecette.est_favoris ? 'Supprimer des favoris' : 'Ajouter aux favoris' }</Text>
                    </TouchableOpacity>
                    <View style={styles.containerDifficulte}>
                        <Text>Difficulté :</Text>
                        <Star score={currentRecette.difficulte} style={styles.starStyle}/>
                    </View>
                    <GeneralInformation recette={currentRecette}/>
                    <Ingredients recette={currentRecette}/>
                    <Card title="Préparation :">
                        <View >
                            <Text >{currentRecette.preparation}</Text>
                        </View>
                     </Card>

                </ScrollView>
            );
        }
        else {
            return (
                <Text>Loading...</Text>
            ); 
        }
    }
}


const styles = StyleSheet.create({
    starStyle: {
        width: 100,
        height: 20,
        marginBottom: 20,
    },
    containerDifficulte: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10, 

    }, 
    button: {
        backgroundColor: '#de1b64', 
        padding: 20, 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center',

    }
})