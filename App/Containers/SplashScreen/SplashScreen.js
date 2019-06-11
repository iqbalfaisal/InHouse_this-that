import React, { Component } from 'react'
import { Image, View, } from 'react-native'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'

// Styles
import styles from './SplashScreenStyle'

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: '',
      userId: '',
      timePassed: false
    };
  }
  resetNavigation(targetRoute,userId,userToken) {
    console.log('check this user id : ', userId)
    console.log('check this access : ', userToken)
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute, params: { userId: userId, userToken: userToken } }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  retrieveDataLoginDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({userToken : value})
      this.setState({userId : value2})
      if (value != null) {
        this.resetNavigation('MainScreen',value2,value);
      }
      else {
        this.resetNavigation('LoginScreen',value2,value);
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.retrieveDataLoginDetails('userTokenGlobal')
    }, 4000)
  }
  render() {
    return (
      <View style={{flex : 1, justifyContent : 'center', alignItems: 'center',}}>
        <Image
          style={{
            width : 100,
            height : 100
          }}
          resizeMode='cover'
          source={require('../../Images/Icons/main-app-logo.png')}
        />
        {/* <Text style={{color : '#FC3838', alignSelf : 'center', marginTop: 10,}}>THIS OR THAT</Text> */}
      </View>
    )
  }
}