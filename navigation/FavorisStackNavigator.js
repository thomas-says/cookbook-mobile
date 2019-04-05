import React from 'react';

import { createStackNavigator } from 'react-navigation';

import DetailsScreen from "../screens/DetailsScreen";
import FavScreen from '../screens/FavScreen';

export default FavorisNavigator = createStackNavigator(
     {
        Favorites: FavScreen,
        Details: DetailsScreen
      },
      {
        initialRouteName: "Favorites"
      }
);
