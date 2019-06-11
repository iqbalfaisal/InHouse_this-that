import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge } from 'react-native-elements'

// Styles
import styles from './ViewAllInterestsScreenStyle'

export default class ViewAllInterestsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      interests: [],
      userInterests: [],
      userSelectedInterests: [],
      fullNameDisplay: '',
      userDescription: '',
      imageSource: '',
      userProfileImage: '',
      userDescription: '',
    };
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
    }
    catch (error) { }
  }
  componentDidMount() {
    this.retrieveDataGlobalDetails('userTokenGlobal')
    const { navigation } = this.props;
    const userFullName = navigation.getParam('userFullName');
    const avatar = navigation.getParam('userAvatar');
    const description = navigation.getParam('userDescription');
    this.setState({ fullNameDisplay: userFullName })
    this.setState({ userProfileImage: avatar })
    this.setState({ userDescription: description })
    const selectedInterests = [];
    selectedInterests.push(navigation.getParam('selectedInterests'))
    for (let i = 0; i < selectedInterests[0].length; i++) {
      this.state.userSelectedInterests.push(selectedInterests[0][i])
      console.log(selectedInterests[0][i])
      //this.state.interests.push({default_id : selectedInterests[0][i]['default_id'], name : selectedInterests[0][i]['name'], id : i})
    }

    const api = API.create();
    api.getDefaultInterests().then(response => {
      this.setState({ userInterests: response.data.data })
      for(let i=0;i<this.state.userInterests.length;i++){
        for(let j=0;j<this.state.userSelectedInterests.length;j++){
          var name1 = this.state.userInterests[i].name
          var name2 = {}
          name2 = this.state.userSelectedInterests[j].name
          var ret = name2.replace('','')
          //console.log('value1 : ',name1)
          //console.log('value2 : ',name2)
          //console.log(this.state.userSelectedInterests[j])
          //this.setState( this.state.userSelectedInterests[i].name = true)
          //console.log(this.state.userInterests[j])
          if(name1 === ret){
            //var found = this.state.userSelectedInterests[j].name
            // var ret = found.replace('','')
            // console.log('bhererererere')
            this.setState({[this.state.userInterests[i].name]:true})
            // console.log(this.state.ret)
            //console.log('value : ',found)
          }
        }
      }
      for (let i = 0; i < selectedInterests[0].length; i++) {
        for(let j=0;j<this.state.userInterests.length;j++){
          if(selectedInterests[0][i]['name'] === this.state.userInterests[j]['name']){
            this.state.interests.push({user_interest_id : selectedInterests[0][i]['user_interest_id'], default_id : selectedInterests[0][i]['default_id'], name : selectedInterests[0][i]['name'], id : j})
          }
        }
      }
    }).catch(error => {
      console.log(error)
    });
  }
  selectInterest = (value, i) => {
    //console.log(i)
    this.setState({ [value]: !this.state[value] })

    if (this.state[value] === undefined) {
      this.state.interests.push({ id: i, name: value })
    }
    else if (this.state[value] === false) {
      this.state.interests.push({ id: i, name: value })
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
    const api = API.create()
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.updateUserInterestsEditProfile(headers, this.state.interests, this.state.userID).then(response => {
      console.log(response)
      if(response.status == 200){
        this.props.navigation.navigate('EditProfileScreen', {
          userTotalInterests: this.state.interests,
          userFullName : this.state.fullNameDisplay,
          userAvatar : this.state.userProfileImage,
          userDescription : this.state.userDescription
        })
      }
    }).catch(error => {
      console.log(error)
    });
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerDefaultInterests}>
          <View style={{ flexDirection: 'row', marginTop: 20, flex: 1, flexWrap: 'wrap', marginLeft: 40 }}>
            {
              this.state.userInterests.map((u, i, arr) => {
                return (
                  <View key={i}>
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
            <Bars size={20} color="#FC3838" />
          </View>
        </Modal>
      </ScrollView>
    )
  }
}