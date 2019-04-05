  import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import EnTete from "../components/EnTete";
import {ScrollView, TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {Icon} from 'react-native-elements'
import RecetteCard from '../components/RecetteCard'
import firebase from '../firebase'; 

export default class TagsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    recetteList: [],
    tagsList: [],
    recetteTrim: [],  
    isLoading: true, 
    tagIsSelected: false,
  }

  async componentDidMount(){
    const recetteList = await this.getRecettes();
    const tagsList = this.getTags(recetteList);  
      this.setState({
          recetteList: recetteList, 
          tagsList: tagsList,
          isLoading: false
      })
  }
   
  async getRecettes() {
        const tableRecette = [];
        const snapshot = await firebase.firestore().collection('recettes').get();
        snapshot.docs.map(doc => {
            const id = doc.id;
            const data = doc.data();
            tableRecette.push({ id, ...data })
        });
        return tableRecette;
  }

  getTags = (recettes) => {
    tagsList = []; 
    recettes.forEach((recette) => {
      recette.tags.forEach((tag) => {
        tagsList.push(tag); 
      })
    })
    return [...new Set(tagsList)]; 
  }

  getRecettesByTag = (tagToMatch) => {
    const {recetteList} = this.state; 
    return recetteTrim = recetteList.filter((recette)=>{
      isTag = false; 
      recette.tags.forEach(tag => {
        if(tag==tagToMatch)
          isTag=true; 
      })
      return isTag;
    })
  }

  trimByTag = (tagToMatch) => {
    const recetteTrim = this.getRecettesByTag(tagToMatch); 
    this.setState({
      recetteTrim: recetteTrim, 
      tagIsSelected: true, 
    })
  }

  render() {
    console.log('helloWorld');
    const {isLoading, tagsList, tagIsSelected} = this.state;
    if(!isLoading && !tagIsSelected){
      console.log(tagsList);
      return (
          <ScrollView>
            <EnTete/>
            <View style={{flex: 1}}>
              {tagsList.map((tag, index) => {
                return(
                  <TouchableOpacity 
                    onPress={() => this.trimByTag(tag)}
                    style={index%2 == 0 ? styles.to_yellow : styles.to_pink} 
                    key={tag}>
                      <Text style={styles.tag_text}>#{tag}</Text>
                  </TouchableOpacity>
                )
              })}  
              </View>
          </ScrollView>
      );
   }
   else if(tagIsSelected) {
   return (<ScrollView>
            <EnTete/>
            <TouchableOpacity 
                    onPress={() => this.setState({tagIsSelected: false})}
                    style={styles.to_pink} 
            >
              <Icon name='search' type='font-awesome'/>
              <Text style={styles.tag_text}>Chercher un autre tag</Text>
            </TouchableOpacity>
            {this.state.recetteTrim.map(recette => {
            return (
                <RecetteCard 
                  recette={recette}
                  navigation={this.props.navigation}
                />
              );
              })}
          </ScrollView>
   )}
  else {
    return (
      <Text>Loading...</Text>
    );
  }
}
}

styles = StyleSheet.create({
  to_yellow: {
    backgroundColor: '#ecb7a1',
    flex: 0.4,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center', 
    alignItems: 'center',  
    marginTop: 10, 
    marginBottom: 10, 
    borderRadius: 20, 
  }, 
  to_pink: {
    backgroundColor: 'white', 
    flex: 0.4,
    flexDirection: 'row',
    padding: 10 ,
    justifyContent: 'center', 
    alignItems: 'center'

  }, 
  tag_text: {
    fontSize: 20,

  }
});
