import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import TagsScreen from '../screens/TagsScreen';
import CartScreen from '../screens/CartScreen';

import HomeNavigator from './HomeStackNavigator'
import FavorisNavigator from './FavorisStackNavigator';
import TagsNavigator from './TagStackNavigator'

const HomeStack = createStackNavigator({
  Home: HomeNavigator,
}, {headerMode: 'none'});

HomeStack.navigationOptions = { 
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

const FavStack = createStackNavigator({
  Favoris: FavorisNavigator,
}, {headerMode: 'none'});

FavStack.navigationOptions = {
  tabBarLabel: 'Favoris',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'}
    />
  ),
};

const TagsStack = createStackNavigator({
  Tags: TagsNavigator,
}, {headerMode: 'none'});

TagsStack.navigationOptions = {
  tabBarLabel: 'Tags',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
    />
  ),
};

const CartStack = createStackNavigator({
    Carts: CartScreen,
});

CartStack.navigationOptions = {
    tabBarLabel: 'Panier',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
        />
    ),
};




export default createBottomTabNavigator({
  HomeStack,
  FavStack,
  TagsStack,
  CartStack,
});
