import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, Image, TouchableOpacity } from 'react-native'
import { Header, Icon, Card, Button, Badge } from 'react-native-elements'
import { TabNavigator, TabBarBottom, TabBarTop } from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from '../Home/HomeScreen'
import SearchScreen from '../Search/SearchScreen'
import ProfileScreen from '../Profile/ProfileScreen'
import Feather from 'react-native-vector-icons/Feather';


// Styles
import styles from './MainScreenStyle'

// export default class MainScreen extends Component {
//   render () {
//     return (
//       <ScrollView style={styles.container}>
//         <KeyboardAvoidingView behavior='position'>
//           <Text>MainScreen</Text>
//         </KeyboardAvoidingView>
//       </ScrollView>
//     )
//   }
// }

export default TabNavigator({
  Home: { screen: HomeScreen},
  Search: { screen: SearchScreen },
  Profile: { screen: ProfileScreen },
},
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        }
        else if (routeName === 'Search') {
          iconName = 'search';
        }
        else if (routeName === 'Profile') {
          iconName = 'user';
        }
        return <Feather name={iconName} size={25} color={tintColor} />
      },
    }),
    tabBarOptions: {
      activeTintColor: '#FC3838',
      inactiveTintColor: '#FC3838',
      showLabel: false,
      showIcon: true,
      style: {
        backgroundColor: 'white',
        borderTopColor : 'transparent'
      },
      indicatorStyle: {
        top : 0,
        borderTopColor : '#FC3838',
        borderTopWidth : 2
      },
    },
    tabBarComponent: TabBarTop,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
  }
);
