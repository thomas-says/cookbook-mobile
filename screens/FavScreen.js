import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { NavigationEvents } from 'react-navigation';
import EnTete from "../components/EnTete";
import RecetteCard from "../components/RecetteCard";
import firebase from "../firebase";

export default class FavScreen extends React.Component {
    
    static navigationOptions = {
        header: null,
      };
      
  render() {
    const {isLoading, favRecettes} = this.state; 
    return (
        <View style={styles.container}>
            <NavigationEvents
            onDidFocus={() => this.componentIsFocus()}
            />
            <View style={{flex: 0.2, justifyContent: 'center'}}>
                <EnTete/>
            </View>
            {!isLoading ?
                <FlatList
                style={{flex: 0.8, marginTop: 10}}
                data={favRecettes}
                renderItem={({item}) =>  <RecetteCard key={item.id} recette={item} navigation={this.props.navigation} />}
                />
            :
                <Text>Loading..</Text>
            }

        </View>
    );
  }
    constructor(props) {
        super(props);
        this.state = {
            favRecettes: [],
            isLoading: true,
        }
    }

    componentDidMount(){
        this.updateRecetteState();     
    }

    componentIsFocus = () => {
        this.updateRecetteState(); 
      }

    async updateRecetteState() {
        const favRecettes = await this.getFavoris();
        this.setState({
            favRecettes: favRecettes,
            isLoading: false
        })
    }


    async getFavoris() {
        const tableRecette = [];
        const snapshot = await firebase.firestore().collection('recettes').where("est_favoris", "==", true).get();
        snapshot.docs.map(doc => {
            const id = doc.id;
            const data = doc.data();
            tableRecette.push({ id, ...data })
        });
        return tableRecette;
    }

   

    
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
