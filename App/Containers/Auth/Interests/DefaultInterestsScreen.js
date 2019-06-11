import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge } from 'react-native-elements'


// Styles
import styles from './DefaultInterestsScreenStyle'

export default class DefaultInterestsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultInterest: [],
      interests: [],
      selectedInterests: [],
      userID : ''
    };
  }
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  componentDidMount() {
    const { navigation } = this.props;
    const userId = navigation.getParam('user_id');
    const userToken = navigation.getParam('user_token');
    this.setState({userID : userId})
    const api = API.create();
    api.getDefaultInterests().then(response => {
      this.setState({ defaultInterest: response.data.data })
    }).catch(error => {
      console.log(error)
    });
  }
  selectInterest = (value, i) => {
    this.setState({ [value]: !this.state[value] })

    if (this.state[value] === undefined) {
      this.state.interests.push({ id: i, value: value })
    }
    else if (this.state[value] === false) {
      this.state.interests.push({ id: i, value: value })
    }
    else {
      for (let j = 0; j < this.state.interests.length; j++) {
        if (i === this.state.interests[j]['id']) {
          this.state.interests.splice(j, 1)
          break
        }
      }
    }
  }
  saveInterests = () =>{
    this.refs.modal3.open()
    for(let i=0; i<this.state.interests.length;i++){
      const value = this.state.interests[i]['value']
      this.state.selectedInterests.push(value)
    }
    const api = API.create();
    api.saveUserInterests(this.state.selectedInterests,this.state.userID).then(response => {
      console.log(response)
      if(response.status == 200){
        this.resetNavigation('LoginScreen')
        this.refs.modal3.close()
      }
    }).catch(error => {
      this.refs.modal3.close()
      this.componentDidMount()
      console.log(error)
    });
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerDefaultInterests}>
          <View style={styles.headerLogoStyle}>
            <Image
              style={styles.mainLogoHeader}
              resizeMode="cover"
              source={require('../../../Images/Icons/main-app-logo.png')}
            />
          </View>
          <Text style={styles.textStyle}> Choose the topics you are interested in </Text>
          <Text style={styles.textStyleContinue}> You can change these later in your profile settings </Text>
          <View style={{ flexDirection: 'row', marginTop: 20, flex: 1, flexWrap: 'wrap', marginLeft: 40 }}>
            {
              this.state.defaultInterest.map((u, i, arr) => {
                return (
                  <View>
                    <Badge containerStyle={[this.state[u.name] ? styles.defaultInterestStyleSelected : styles.defaultInterestStyle]} onPress={() => this.selectInterest(u.name, i)}>
                      <Text style={[this.state[u.name] ? styles.defaultInterestStyleSelectedText : styles.defaultInterestStyleText]}>{u.name}</Text>
                    </Badge>
                  </View>
                );
              })
            }
          </View>
          <TouchableOpacity style={styles.saveInterestsButton} onPress={this.saveInterests}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
              style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
          <View>
            <Bars size={20} color="#FC3838"/>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}