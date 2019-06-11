import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button, RefreshControl } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import renderIf from '../../CustomComponents/RenderIf/renderIf'
import moment from 'moment';


// Styles
import styles from './CreatePollScreenStyle'
const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class CreatePollScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      pollDescription: '',
      daysCounter: number = 0,
      userPollImage1: '',
      userPollImage2: '',
      pollID : '',
      pollImages : [],
      pollExpiration : '',
      pollMembers : [],
      optionID1 : '',
      optionID2 : ''
    };
  }
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute, params: { userId: this.state.userId, userToken: this.state.userToken } }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  componentDidMount() {
    console.log('Create Poll Screen')
    const { navigation } = this.props;
    const viewPollID = navigation.getParam('viewPollID');
    this.setState({ pollID: viewPollID })
    //this.setState({ pollID: '73' })
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      if(this.state.pollID != '' || this.state.pollID != null || this.state.pollID != undefined){
        this.getPollDetails(value2, value)
      }
      //this.getUserFriends(value2, value)
    }
    catch (error) { }
  }
  getPollDetails = (userID, accessToken) => {
    //Test
    //this.setState({ pollID: '68' })
    //TestEND
    const api = API.create();
    const headers = {
      'access_token': accessToken,
      'user_id': userID
    }
    api.viewPollDetails(headers, this.state.pollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.setState({ pollExpiration: response.data.expiration })
          this.setState({ pollImages: response.data.options })
          this.setState({ pollMembers: response.data.members })
          this.setState({ pollDescription: response.data.description })
          //console.log('check this poll images ',this.state.pollImages[0].option_image_url)
          this.setState({userPollImage1 : this.state.pollImages[0].option_image_url})
          this.setState({userPollImage2 : this.state.pollImages[1].option_image_url})
          this.setState({optionID1 : this.state.pollImages[0].option_id})
          this.setState({optionID2 : this.state.pollImages[1].option_id})
          this.setState({daysCounter : this.state.pollExpiration.days})
          //console.log('check this poll images ',this.state.userPollImage1)
        }
        else {
          this.refs.modal3.close()
        }
      })
      .catch(error => {
        this.refs.modal3.close()
      })
  }
  daysCounter() {
    var test = this.state.daysCounter
    this.setState({ daysCounter: (test + 1) })
  }
  daysCounter2() {
    var test = this.state.daysCounter
    if (test > 0) {
      this.setState({ daysCounter: (test - 1) })
    }
  }
  nextPressed = () => {
    console.log('check this poll id first : ',this.state.pollID)
    if (this.state.daysCounter <= 0) {
      ToastAndroid.show('Expiration time cannot be 0 Days', ToastAndroid.LONG);
    }
    else {
      if (this.state.pollDescription == '') {
        ToastAndroid.show('Your poll description cannot be empty', ToastAndroid.LONG);
      }
      else {
        if (this.state.userPollImage1 != '' && this.state.userPollImage2 != '') {
          this.props.navigation.navigate('InviteFriendsOnPollScreen', {
            userPollDescription: this.state.pollDescription,
            userPollImage1: this.state.userPollImage1,
            userPollImage2: this.state.userPollImage2,
            userPollExpirationTime: this.state.daysCounter,
            pollMembers : this.state.pollMembers,
            pollID: this.state.pollID,
            optionID1 : this.state.optionID1,
            optionID2 : this.state.optionID2
          })
        }
        else {
          ToastAndroid.show('Your poll must contain two images', ToastAndroid.LONG);
        }
      }
    }
  }
  imagePickerDefault = () => {
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = { uri: response.uri };    
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          userPollImage1: source.uri,
        });
      }
    });
  }
  imagePickerDefault2 = () => {
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = { uri: response.uri };    
        const source2 = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          userPollImage2: source2.uri,
        });
      }
    });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerCreatePoll} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
            <TextInput style={[styles.textInput, !this.state.validated ? styles.error : null]} placeholder="Add a Description" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'}
              autoCapitalize={'none'} maxLength={80} autoCorrect={false} onChangeText={(text) => this.setState({ pollDescription: text })}
              value={this.state.pollDescription}>
            </TextInput>
            <Text style={[{ alignSelf: 'flex-end' }, this.state.pollDescription.length > 80 ? { color: 'red' } : null]}>{this.state.pollDescription.length}/80</Text>
          </View>
          <View>
            <Text style={{ alignSelf: 'flex-start', color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 5, }}>Add first option</Text>
            {/* {renderIf(this.state.pollID != '')(
              <TouchableOpacity onPress={this.imagePickerDefault}>
                <View style={{ height: 150, marginTop: 10, paddingLeft: 15, paddingRight: 15 }}>
                  <Image
                    style={{
                      flex: 1,
                      height: undefined,
                      width: undefined,
                    }}
                    resizeMode='cover'
                    source={{ uri: this.state.pollImages[0].option_image_url }}
                  />
                </View>
              </TouchableOpacity>
            )} */}
            {renderIf(this.state.userPollImage1 != '' && this.state.userPollImage1 != null && this.state.userPollImage1 != undefined)(
              <TouchableOpacity onPress={this.imagePickerDefault}>
                <View style={{ height: 150, marginTop: 10, paddingLeft: 15, paddingRight: 15 }}>
                  <Image
                    style={{
                      flex: 1,
                      height: undefined,
                      width: undefined,
                    }}
                    resizeMode='cover'
                    source={{ uri: this.state.userPollImage1 }}
                  />
                </View>
              </TouchableOpacity>
            )}
            {renderIf(this.state.userPollImage1 == null || this.state.userPollImage1 == '' || this.state.userPollImage1 == undefined)(
              <TouchableOpacity onPress={this.imagePickerDefault}>
                <Card containerStyle={{ alignContent: 'center', alignItems: 'center', height: 150 }}>
                  <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: 40 }}>
                    <Feather name='image' size={38} color='#FC3838' />
                    <Text style={{ color: '#757575', marginTop: 10, marginLeft: 5 }}>Add an Image</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ alignSelf: 'flex-start', color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 5, }}>Add second option</Text>
            {/* {renderIf(this.state.pollID != '')(
              <TouchableOpacity onPress={this.imagePickerDefault2}>
                <View style={{ height: 150, marginTop: 10, paddingLeft: 15, paddingRight: 15 }}>
                  <Image
                    style={{
                      flex: 1,
                      height: undefined,
                      width: undefined,
                    }}
                    resizeMode='cover'
                    source={{ uri: this.state.pollImages[1].option_image_url }}
                  />
                </View>
              </TouchableOpacity>
            )} */}
            {renderIf(this.state.userPollImage2 != '' && this.state.userPollImage2 != null && this.state.userPollImage2 != undefined)(
              <TouchableOpacity onPress={this.imagePickerDefault2}>
                <View style={{ height: 150, marginTop: 10, paddingLeft: 15, paddingRight: 15 }}>
                  <Image
                    style={{
                      flex: 1,
                      height: undefined,
                      width: undefined,
                    }}
                    resizeMode='cover'
                    source={{ uri: this.state.userPollImage2 }}
                  />
                </View>
              </TouchableOpacity>
            )}
            {renderIf(this.state.userPollImage2 == null || this.state.userPollImage2 == '' || this.state.userPollImage2 == undefined)(
              <TouchableOpacity onPress={this.imagePickerDefault2}>
                <Card containerStyle={{ alignContent: 'center', alignItems: 'center', height: 150 }}>
                  <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: 40 }}>
                    <Feather name='image' size={38} color='#FC3838' />
                    <Text style={{ color: '#757575', marginTop: 10, marginLeft: 5 }}>Add an Image</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ alignSelf: 'flex-start', color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 5, }}>Expiration time</Text>
            <View style={{ alignSelf: 'center', textAlign: 'center' }}>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => this.daysCounter2()} style={styles.subtractDays}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: 10, marginTop: -2, }}>-</Text>
                </TouchableOpacity>
                <Text style={{ color: '#FC3838', fontWeight: 'bold', fontSize: 18, marginLeft: -10, marginRight: 10, }}>{this.state.daysCounter}</Text>
                <TouchableOpacity onPress={() => this.daysCounter()} style={styles.addDays}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: 7, marginTop: -2 }}>+</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity onPress={() => this.daysCounter()}>
                <Text style={{ color: '#FC3838', fontWeight: 'bold', fontSize: 18 }}>{this.state.daysCounter}</Text>
              </TouchableOpacity> */}
              <Text style={{ color: '#757575', marginTop: 5, alignSelf: 'center', marginLeft: -10 }}>Days</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.createPollNextButton} onPress={this.nextPressed}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
              style={{ height: 48, width: 300, alignItems: 'center', justifyContent: 'center', width: 300, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>NEXT</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
            <View>
              <Bars size={20} color="#FC3838" />
            </View>
          </Modal> */}
        </ScrollView>
      </View>
    )
  }
}