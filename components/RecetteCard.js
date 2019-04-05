import React from 'react';

import { View, Text, Image } from 'react-native'
import { Card, ListItem, Button, Icon } from 'react-native-elements';



export default class RecetteCard extends React.Component {

    render() { 
        return (
            <Card

                title={this.props.recette.nom}
                image={{uri: this.props.recette.imageUrl}}>
                <Button
                    icon={<Icon type="font-awesome" name='eye' color='#ffffff' iconStyle={{marginRight:10}}/>}
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor: '#de1b64',}}
                    title='Voir plus..'
                    onPress={() => this.handlePress(this.props.recette.id)}/>
            </Card>
        );
    }

    handlePress=(id)=>{
        this.props.navigation.navigate('Details', {idRecette: id}); 
    }
}
