import React from 'react';
import {Header,Image} from 'react-native-elements';


export default class EnTete extends React.Component {

    render() {
        return (
            <Header containerStyle={{
                backgroundColor: '#FFFF',
                height: 160,
                flex: 1,


            }}>
                <Image source={require('../assets/images/Logo.png')} style={{ width: 340, height: 100,alignItems: 'center', justifyContent: 'center' }}/>
            </Header>
        );
    }
}
