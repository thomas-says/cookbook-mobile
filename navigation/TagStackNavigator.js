import React from 'react';

import { createStackNavigator } from 'react-navigation';

import DetailsScreen from "../screens/DetailsScreen";
import TagsScreen from '../screens/TagsScreen';

export default FavorisNavigator = createStackNavigator(
     {
        Tags: TagsScreen,
        Details: DetailsScreen
      },
      {
        initialRouteName: "Tags"
      }
);
