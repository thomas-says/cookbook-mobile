import React from 'react';

import { View, Text, Image, StyleSheet } from 'react-native'
import { Card, Divider } from 'react-native-elements'


export default GeneralInformation = (props) => {
    return (
        <Card title="Informations générales">
            <View style={styles.informationView}>
                <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={require('../assets/images/ustensiles.png')}
                />
                <Text style={styles.name}>{props.recette.temps_preparation} minutes</Text>
            </View>
            <Divider />
            <View style={styles.informationView}>
                <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={require('../assets/images/four.png')}
                />
                <Text style={styles.name}>{props.recette.temps_cuisson !== 0 ? props.recette.temps_cuisson + " minutes" : "Pas de cuisson nécessaire"}</Text>
            </View>
            <Divider />
            <View style={styles.informationView}>
                <Image
                    style={styles.image}
                    source={require('../assets/images/gateau_parts.png')}
                />
                <Text style={styles.name}>{props.recette.nb_personnes} personnes</Text>
            </View>
        </Card>
    ); 
}

const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 30,
        marginRight: 10, 
    }, 
    name: {
        fontSize: 18

    }, 
    informationView: { 
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10 
    }
})