import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button, RefreshControl, BackHandler } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge, CheckBox } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import renderIf from '../../../CustomComponents/RenderIf/renderIf'
import moment from 'moment';

// Styles
import styles from './InviteFriendsOnPollScreenStyle'

export default class InviteFriendsOnPollScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      userPollDescription: '',
      userPollImage1: '',
      userPollImage2: '',
      userPollExpirationTime: number = 0,
      friends: [],
      checked: boolean = false,
      checkedMembers: [],
      checkedMembers2: [],
      userPollImages: [],
      createdPollID: '',
      pollMembers: [],
      pollID: '',
      optionID1: '',
      optionID2: ''
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
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getUserFriends(value2, value)
    }
    catch (error) { }
  }
  componentDidMount() {
    console.log('Invite Friends on Poll Screen')
    const { navigation } = this.props;
    const userPollDescription = navigation.getParam('userPollDescription');
    const userPollImage1 = navigation.getParam('userPollImage1');
    const userPollImage2 = navigation.getParam('userPollImage2');
    const optionID1 = navigation.getParam('optionID1');
    const optionID2 = navigation.getParam('optionID2');
    this.setState({ optionID1: optionID1 })
    this.setState({ optionID2: optionID2 })
    const pollID = navigation.getParam('pollID');
    this.setState({ pollID: pollID })
    if (pollID == '' || pollID == undefined || pollID == null) {
      this.state.userPollImages.push(userPollImage1)
      this.state.userPollImages.push(userPollImage2)
    }
    else {
      this.state.userPollImages.push({ option_id: this.state.optionID1, option_image_url: userPollImage1 })
      this.state.userPollImages.push({ option_id: this.state.optionID2, option_image_url: userPollImage2 })
    }
    // this.state.interests.push({user_interest_id : selectedInterests[0][i]['user_interest_id'], default_id : selectedInterests[0][i]['default_id'], name : selectedInterests[0][i]['name'], id : j})
    //this.state.userPollImages.push(userPollImage2)
    const userPollExpirationTime = navigation.getParam('userPollExpirationTime');
    const pollMembers = []
    pollMembers.push(navigation.getParam('pollMembers'))
    this.setState({ userPollDescription: userPollDescription })
    this.setState({ userPollImage1: userPollImage1 })
    this.setState({ userPollImage2: userPollImage2 })
    this.setState({ userPollExpirationTime: userPollExpirationTime })
    this.retrieveDataGlobalDetails('userTokenGlobal')
    this.refs.modal3.open()
    for (let i = 0; i < pollMembers[0].length; i++) {
      this.state.pollMembers.push(pollMembers[0][i])
    }
  }
  getUserFriends = (userID, accessToken) => {
    const api = API.create();
    const headers = {
      'access_token': accessToken,
      'user_id': userID
    }
    api.getAllUserInformation(headers, this.state.userID, moment().utc().format('YYYY-MM-DD HH:mm:ss'), 'All')
      .then(response => {
        this.refs.modal3.close()
        //console.log(response)
        if (response.status == 200) {
          this.setState({ friends: response.data.friends.data })
          console.log('check friends : ', this.state.friends)
          for (let i = 0; i < this.state.friends.length; i++) {
            for (let j = 0; j < this.state.pollMembers.length; j++) {
              if (this.state.friends[i].user_id_of_contact == this.state.pollMembers[j].user_id_of_contact) {
                this.setState({ [this.state.friends[i].user_name]: true })
                var number = parseInt(this.state.friends[i].user_id_of_contact);
                this.state.checkedMembers2.push({ member_id: this.state.pollMembers[j].member_id, user_id_of_contact: number })
              }
            }
          }
        }
      })
      .catch(error => {
        this.refs.modal3.close()
      })
  }
  onPressCard = (clickedUserID, otherUserProfileName) => {
    this.props.navigation.navigate('ViewUserProfileScreen', {
      otherUserID: clickedUserID,
      otherUserProfileName: otherUserProfileName
    })
  }
  createPollPressed = () => {
    // console.log('create poll called : ',this.state.checkedMembers)
    // console.log('create poll called : ',this.state.userPollDescription)
    // console.log('create poll called : ',this.state.userPollExpirationTime)
    // console.log('create poll called : ',this.state.userPollImages)
    this.refs.modal3.open()
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    if (this.state.checkedMembers != null && this.state.checkedMembers.length != 0) {
      api.createPoll(headers, this.state.userID, this.state.userPollDescription, this.state.userPollExpirationTime, moment().utc().format('YYYY-MM-DD HH:mm:ss'), 'Custom', this.state.userPollImages, this.state.checkedMembers)
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.refs.modal3.close()
            this.setState({ createdPollID: response.data.data.id })
            this.props.navigation.navigate('ViewPollScreen', {
              viewPollID: this.state.createdPollID,
            })
          }
          else {
            this.refs.modal3.close()
          }
        })
        .catch(error => {
          this.refs.modal3.close()
        })
    }
    else {
      api.createPoll(headers, this.state.userID, this.state.userPollDescription, this.state.userPollExpirationTime, moment().utc().format('YYYY-MM-DD HH:mm:ss'), 'Friends', this.state.userPollImages, this.state.checkedMembers)
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.refs.modal3.close()
            this.setState({ createdPollID: response.data.data.id })
            this.props.navigation.navigate('ViewPollScreen', {
              viewPollID: this.state.createdPollID,
            })
          }
          else {
            this.refs.modal3.close()
          }
        })
        .catch(error => {
          this.refs.modal3.close()
        })
    }
  }
  savePollPressed = () => {
    // (headers,pollID,pollDescription, expirationDays,currentDate, privacyType, imagesArray,friendsArray)
    console.log('chck this : ', this.state.userPollImages)
    console.log('check this as well : ', this.state.checkedMembers2)
    this.refs.modal3.open()
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    if (this.state.checkedMembers2 != null && this.state.checkedMembers2.length != 0) {
      api.updatePoll(headers, this.state.pollID, this.state.userPollDescription, this.state.userPollExpirationTime, moment().utc().format('YYYY-MM-DD HH:mm:ss'), 'Custom', this.state.userPollImages, this.state.checkedMembers2)
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.refs.modal3.close()
            this.setState({ createdPollID: response.data.data.id })
            this.props.navigation.navigate('ViewPollScreen', {
              viewPollID: this.state.createdPollID,
            })
          }
          else {
            this.refs.modal3.close()
          }
        })
        .catch(error => {
          this.refs.modal3.close()
        })
    }
    else {
      api.updatePoll(headers, this.state.pollID, this.state.userPollDescription, this.state.userPollExpirationTime, moment().utc().format('YYYY-MM-DD HH:mm:ss'), 'Friends', this.state.userPollImages, this.state.checkedMembers2)
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.refs.modal3.close()
            this.setState({ createdPollID: response.data.data.id })
            this.props.navigation.navigate('ViewPollScreen', {
              viewPollID: this.state.createdPollID,
            })
          }
          else {
            this.refs.modal3.close()
          }
        })
        .catch(error => {
          this.refs.modal3.close()
        })
    }
  }
  render() {
    if (this.state.pollID == '' || this.state.pollID == undefined || this.state.pollID == null) {
      if (this.state.friends) {
        return (
          <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
            <ScrollView style={styles.mainContainerFriends} showsVerticalScrollIndicator={false}>
              <View>
                {
                  this.state.friends && this.state.friends.map((u, i) => {
                    return (
                      <Card>
                        <View key={u.id} style={styles.mainCard}>
                          <TouchableOpacity onPress={() => this.onPressCard(u.user_id_of_contact, u.user_full_name)} style={styles.cardTouchableOpacity}>
                            <View style={styles.cardView}>
                              <Image
                                style={styles.image}
                                resizeMode="cover"
                                source={require('../../../../Images/Icons/Avatar.png')}
                              />
                              <Text style={styles.name}>{u.user_full_name}</Text>
                            </View>
                          </TouchableOpacity>
                          <View style={styles.inviteButton}>
                            <View style={{ flexDirection: 'row' }}>
                              <CheckBox
                                checkedIcon='check-circle'
                                uncheckedIcon='circle'
                                iconType='feather'
                                checkedColor='#FC3838'
                                uncheckedColor='#FC3838'
                                checked={this.state[u.user_name]}
                                onPress={() => {
                                  this.setState({ [u.user_name]: !this.state[u.user_name] })
                                  var number = parseInt(u.user_id_of_contact);
                                  this.state.checkedMembers.push(number)
                                  this.state.checkedMembers2.push({ user_id_of_contact: number })
                                }}
                              />
                            </View>
                          </View>
                          <Text style={styles.username}>@{u.user_name}</Text>
                          {/* User Interests */}
                          <View>
                            <Text style={{ alignSelf: 'flex-start', color: 'black', marginTop: 20 }}>
                              Interests
                            </Text>
                            <ScrollView style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                              {
                                u.interests.map((j, k) => {
                                  return (
                                    <View key={i}>
                                      <Badge containerStyle={styles.interestsStyle}>
                                        <View>
                                          <Text style={{ color: 'white' }}>{j.name}</Text>
                                        </View>
                                      </Badge>
                                    </View>
                                  );
                                })
                              }
                            </ScrollView>
                          </View>
                        </View>
                      </Card>
                    );
                  })
                }
              </View>
              {/* Loading Modal */}
              <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
                <View>
                  <Bars size={20} color="#FC3838" />
                </View>
              </Modal>
            </ScrollView>
            <TouchableOpacity style={styles.createPollButton} onPress={this.createPollPressed}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 300, alignItems: 'center', justifyContent: 'center', width: 300, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>CREATE POLL</Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* <Text style={styles.viewPendingRequests} onPress={() => this.props.navigation.navigate('ViewPendingRequestsScreen')}>View pending requests</Text> */}
          </View>
        )
      }
      else {
        return (
          <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
            <ScrollView style={styles.mainContainerFriends} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight : 30, marginTop : 30 }}>
                <Image
                  style={{
                    width: 100,
                    height: 100
                  }}
                  resizeMode='cover'
                  source={require('../../../../Images/EmptyStatsImages/ghost.png')}
                />
                <Text style={{color: '#757575', alignSelf : 'center', marginTop: 10,flexWrap: 'wrap', textAlign : 'center'}}>You can create a poll but, ghosts won't vote. Add friends to share the poll with.</Text>
              </View>
              {/* Loading Modal */}
              <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
                <View>
                  <Bars size={20} color="#FC3838" />
                </View>
              </Modal>
            </ScrollView>
            <TouchableOpacity style={styles.createPollButton} onPress={this.createPollPressed}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 300, alignItems: 'center', justifyContent: 'center', width: 300, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>CREATE POLL</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )
      }
    }
    else {
      return (
        <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
          <ScrollView style={styles.mainContainerFriends} showsVerticalScrollIndicator={false}>
            <View>
              {
                this.state.friends && this.state.friends.map((u, i) => {
                  return (
                    <Card>
                      <View key={u.id} style={styles.mainCard}>
                        <TouchableOpacity onPress={() => this.onPressCard(u.user_id_of_contact, u.user_full_name)} style={styles.cardTouchableOpacity}>
                          <View style={styles.cardView}>
                            <Image
                              style={styles.image}
                              resizeMode="cover"
                              source={require('../../../../Images/Icons/Avatar.png')}
                            />
                            <Text style={styles.name}>{u.user_full_name}</Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.inviteButton}>
                          <View style={{ flexDirection: 'row' }}>
                            <CheckBox
                              checkedIcon='check-circle'
                              uncheckedIcon='circle'
                              iconType='feather'
                              checkedColor='#FC3838'
                              uncheckedColor='#FC3838'
                              checked={this.state[u.user_name]}
                              onPress={() => {
                                this.setState({ [u.user_name]: !this.state[u.user_name] })
                                var number = parseInt(u.user_id_of_contact);
                                this.state.checkedMembers.push(number)
                                this.state.checkedMembers2.push({ user_id_of_contact: number })
                              }}
                            />
                          </View>
                        </View>
                        <Text style={styles.username}>@{u.user_name}</Text>
                        {/* User Interests */}
                        <View>
                          <Text style={{ alignSelf: 'flex-start', color: 'black', marginTop: 20 }}>
                            Interests
                        </Text>
                          <ScrollView style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                              u.interests.map((j, k) => {
                                return (
                                  <View key={i}>
                                    <Badge containerStyle={styles.interestsStyle}>
                                      <View>
                                        <Text style={{ color: 'white' }}>{j.name}</Text>
                                      </View>
                                    </Badge>
                                  </View>
                                );
                              })
                            }
                          </ScrollView>
                        </View>
                      </View>
                    </Card>
                  );
                })
              }
            </View>
            {/* Loading Modal */}
            <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
              <View>
                <Bars size={20} color="#FC3838" />
              </View>
            </Modal>
          </ScrollView>
          <TouchableOpacity style={styles.createPollButton} onPress={this.savePollPressed}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
              style={{ height: 48, width: 300, alignItems: 'center', justifyContent: 'center', width: 300, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <Text style={styles.viewPendingRequests} onPress={() => this.props.navigation.navigate('ViewPendingRequestsScreen')}>View pending requests</Text> */}
        </View>
      )
    }
  }
}