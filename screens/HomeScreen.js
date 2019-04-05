import React from 'react';
import {
  Image,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import EnTete from '../components/EnTete';
import RecetteCard from '../components/RecetteCard';
import firebase from '../firebase'; 
import { Button, Input } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';

const PAGINATION_LIMIT = 8;
  

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {
    super(props);
    this.state = {
        listeRecette: [],
        listeViewable: [], 
        listeTrim: [], 
        searchValue: "", 
        isLoading: true,
        pagination: {
          startAt: 0,
          endAt: 0,  
          loadNext: false, 
        }
    }
    this.getRecettes = this.getRecettes.bind(this)
  }
  /**
   * Execute la mise à jour des données dans le state
   */
  async componentDidMount(){ 
    const firstDoc = await this.getStartAt();

    this.setState(
      {pagination: 
        {startAt: firstDoc.created_at}
      }, async () => {
        const listeRecette = await this.getRecettes();
        this.setState({
            listeRecette: listeRecette,
            isLoading: false,
        }) 
      })
    
  } 

  async getStartAt() {
    const query = firebase.firestore().collection('recettes').orderBy("created_at").limit(1);
    const snapshot = await query.get();
    return snapshot.docs[0].data(); 
  }

    /**
     * Récupère les recettes en base de données
     */
    async getRecettes() {
      const {startAt} = this.state.pagination; 
      const newRecettes = [];
      const query = firebase.firestore().collection('recettes').orderBy("created_at").startAfter(startAt).limit(PAGINATION_LIMIT);
      const snapshot = await query.get()
      snapshot.docs.map(doc => {
          const id = doc.id;
          const data = doc.data();
          newRecettes.push({ id, ...data })
      });
      this.setState({pagination:{ startAt: newRecettes[newRecettes.length-1].created_at}})
      
      return newRecettes;
    }

    handleChange = (inputValue) => { 
      listeTrim = this.state.listeRecette.filter(recette => recette.nom.toLowerCase().includes(inputValue.toLowerCase()));
      this.setState({
        listeTrim: listeTrim,
        searchValue: inputValue,
      })
    }

    isntEndPage() {
      return this.state.listeRecette.length%PAGINATION_LIMIT == 0 ? true : false;  
    }

    async handlePaginate() {  
      if(this.isntEndPage()) {
        const {listeRecette} = this.state;
        this.setState({pagination: {...this.state.pagination, loadNext: true}})
        const recettesToAdd = await this.getRecettes();
        this.setState({pagination: {...this.state.pagination, loadNext: false}})
        this.setState({
        listeRecette: listeRecette.concat(recettesToAdd),
        }) 
      }     
    }

    render() {
      const {isLoading, listeRecette, listeTrim, searchValue} = this.state
      const {loadNext} = this.state.pagination;
      return (
        <View style={styles.container}>
          <View style={{flex:0.1, justifyContent: 'center', paddingTop: 50}}>
            <EnTete/>
          </View>
          <View style={{flex:0.2, justifyContent: 'center', paddingTop: 20}}>
               <Input
                  onChangeText={(value) => this.handleChange(value)}
                  value={searchValue}
                  placeholder='Rechercher une recette...'
                  leftIcon={{ type: 'font-awesome', name: 'search' }}
                />
          </View>
          
          
          {!isLoading ?
                
                <FlatList
                  style={{flex: 0.8}}
                  data={searchValue == "" ? listeRecette : listeTrim}
                  renderItem={({item}) =>  <RecetteCard key={item.id} recette={item} navigation={this.props.navigation} />}
                  onEndReached={this.handlePaginate.bind(this)}
                  onEndReachedThreshold={0.1}
                />
          :
          <ActivityIndicator size="large" color="#03A9F4" />
          }
          {loadNext &&
              <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#03A9F4" />
                <Text>Chargement des recette suivantes...</Text>
              </View>
            }
        </View>
      );
    }

    

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#de1b64',
  },
});
