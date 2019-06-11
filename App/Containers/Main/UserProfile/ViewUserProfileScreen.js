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
import { Header, Icon, Card, Badge, Avatar } from 'react-native-elements'
import renderIf from '../../CustomComponents/RenderIf/renderIf'
import { BackHandler } from 'react-native'
import { TabNavigator, TabBarBottom, TabBarTop } from "react-navigation"
import Feather from 'react-native-vector-icons/Feather'
import ActionSheet from 'react-native-actionsheet'

// Styles
import styles from './ViewUserProfileScreenStyle'

const options = [
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>VIEW ALL</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>ACTIVE</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>IN-ACTIVE</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]

export default class ViewUserProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      userID: '',
      accessToken: '',
      otherUserID: '',
      userProfileImage: '',
      userFullName: '',
      userNameDisplay: '',
      userAbout: '',
      invitationStatus: '',
      userFriendInterests: [],
      friendPolls: [],
      noPollsFlag: boolean = false,
      userFriendCount : ''
    };
  }

  retrieveDataLoginDetails = async (getValue) => {
    this.refs.modal3.open()
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      console.log(value)
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getUserData(value2, value)
    }
    catch (error) { }
  }

  componentDidMount() {
    this.retrieveDataLoginDetails('userTokenGlobal')
    const { navigation } = this.props;
    const otherUserID = navigation.getParam('otherUserID');
    this.setState({ otherUserID: otherUserID })
    //this.setState({ otherUserID: '12' })
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  getUserData = () => {
    const api = API.create()
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.viewProfileOtherUser(headers, this.state.userID, this.state.otherUserID).then(response => {
      console.log(response)
      if (response.status == 200) {
        this.setState({ userProfileImage: response.data.profile_pic })
        this.setState({ userFullName: response.data.fullname })
        this.setState({ userNameDisplay: response.data.username })
        this.setState({ userAbout: response.data.description })
        this.setState({ invitationStatus: response.data.status })

        if (this.state.invitationStatus == 'Friend') {
          this.setState({ userFriendInterests: response.data.interests })
          this.setState({ friendPolls: response.data.polls.data })
          this.setState({ userFriendCount: response.data.friends.count })
        }
        else {
          this.setState({ friendPolls: null })
        }
        if (this.state.friendPolls == null) {
          this.setState({ friendPolls: [] })
          this.setState({ noPollsFlag: true })
          console.log('frind polls are null')
        }
        console.log(this.state.friendPolls)
        this.refs.modal3.close()
      }
    }).catch(error => {
      console.log(error)
    });
  }
  addFriend = (user_id) => {
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.addFriend(headers, this.state.userID, user_id)
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          ToastAndroid.show('Invitation sent successfully', ToastAndroid.LONG);
          this.getUserData()
        }
      })
      .catch(error => {

      })
  }
  deleteInvitation = (user_id) => {
    // console.log('invited user id ' + user_id)
    // console.log('current user id ' + this.state.userID)
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.deleteFriendRequest(headers, user_id)
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          ToastAndroid.show('Invitation deleted successfully', ToastAndroid.LONG);
          this.getUserData()
        }
      })
      .catch(error => {

      })
  }
  openFriendPoll = (pollID) => {
    this.props.navigation.navigate('ViewPollScreen', {
      viewPollID: pollID
    })
  }
  render() {
    if (this.state.friendPolls) {
      return (
        <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
          <ScrollView style={styles.mainContainerProfile}>
            <View style={styles.mainProfileHeader}>
              {/* Header User Profile Image And Edit Button */}

              {/* If User Image Is Null, Showing Default Image */}
              {renderIf(this.state.userProfileImage == null)(
                <View>
                  <Image
                    style={{
                      marginTop: 20,
                      height: 120,
                      width: 120,
                      borderRadius: 65
                    }}
                    resizeMode='cover'
                    source={require('../../../Images/Icons/Avatar.png')}
                  />
                </View>
              )}
              {/* If User Image Is Not Null, Showing User Image */}
              {renderIf(this.state.userProfileImage != null)(
                <View>
                  <Image
                    style={{
                      marginTop: 20,
                      height: 120,
                      width: 120,
                      borderRadius: 65
                    }}
                    resizeMode='cover'
                    source={{ uri: this.state.userProfileImage }}
                  />
                  {/* <View style={{ backgroundColor: '#FC3838', padding: 5, borderRadius: 25, width: 30, alignSelf: 'flex-end', marginTop: -30 }}>
                  <Icon
                    type='font-awesome'
                    size={20}
                    name='edit'
                    color='white'
                    onPress={() => this.props.navigation.navigate('EditProfileScreen', {
                      userFullName: this.state.userFullName,
                      userAvatar: this.state.userProfileImage,
                      userDescription: this.state.userDescription,
                      userInterests: this.state.userInterests
                    })
                    }
                  />
                </View> */}
                </View>
              )}
            </View>
            {/* User Display Name */}
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.userFullName}>{this.state.userFullName}</Text>
            </View>
            {/* UserName Display */}
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.userNameDisplay}>@{this.state.userNameDisplay}</Text>
            </View>
            {/* Friends Count */}
            <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, marginTop: 13 }}>
              <TouchableOpacity>
                <View>
                  <Text style={{ marginTop: 5, fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>{this.state.userFriendCount}</Text>
                  <Text style={{ fontSize: 17 }}>Friends</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* User Description Display */}
            <View style={{ alignSelf: 'flex-start' }}>
              <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 17 }}>About</Text>
              <Text style={styles.userNameDisplay}>{this.state.userAbout}</Text>
            </View>
            {/* User Interests Display */}
            {renderIf(this.state.userFriendInterests != null && this.state.userFriendInterests != undefined)(
              <View>
                <Text style={{ alignSelf: 'flex-start', color: 'black', marginTop: 20 }}>
                  Interests
              </Text>
                <ScrollView style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                  {
                    this.state.userFriendInterests.map((j, k) => {
                      return (
                        <View key={j.user_interest_id}>
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
            )}
            {renderIf(this.state.invitationStatus == 'Uninvited')(
              <View>
                <TouchableOpacity style={styles.addFriendButton} onPress={() => this.addFriend(this.state.otherUserID)}>
                  <LinearGradient
                    colors={['#FC3838', '#F52B43', '#ED0D51']}
                    start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                    style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
            {renderIf(this.state.invitationStatus == 'Invited')(
              <View>
                <TouchableOpacity style={styles.addFriendButton} onPress={() => this.deleteInvitation(this.state.otherUserID)}>
                  <LinearGradient
                    colors={['#FC3838', '#F52B43', '#ED0D51']}
                    start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                    style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>CANCEL INVITATION</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
            {/* Main Card to show Friend Polls */}
            {renderIf(this.state.noPollsFlag == false)(
              <View>
                <Header
                  leftComponent={
                    <Text style={{ color: '#FC3838', fontWeight: 'bold' }}>Polls</Text>
                  }
                  centerComponent={
                    <View />
                  }
                  rightComponent={
                    <Icon
                      type='material-community'
                      size={25}
                      name='filter-variant'
                      color='#FC3838'
                      onPress={() => {
                        this.ActionSheet.show()
                      }}
                    />
                  }
                  containerStyle={{
                    backgroundColor: 'white',
                    justifyContent: 'space-around',
                    borderBottomWidth: 0,
                  }}
                />
                <Card containerStyle={{
                  shadowColor: 'rgba(252, 56, 56, 0.2)',
                  shadowOpacity: 0.5,
                  elevation: 1,
                  shadowRadius: 10,
                  shadowOffset: { width: 1, height: 3 },
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  marginBottom: 20,
                  marginLeft: 0,
                  marginRight: 0
                }}>
                  {
                    this.state.friendPolls && this.state.friendPolls.map((j, k) => {
                      return (
                        <View>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignSelf: 'flex-start' }}>
                              <Image
                                style={{
                                  height: 40,
                                  width: 40,
                                  borderRadius: 25,
                                  marginBottom: 20,
                                }}
                                resizeMode='cover'
                                source={{ uri: j.profile_pic }}
                              />
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FC3838', alignSelf: 'flex-start', marginTop: 5, marginLeft: 5 }}>{j.user_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', position: 'absolute', right: 0 }}>
                              <Icon
                                type='ionicon'
                                size={20}
                                name='md-more'
                                color='#FC3838'
                                containerStyle={{
                                  marginTop: 5
                                }}
                              />
                            </View>
                          </View>
                          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#87888F', alignSelf: 'flex-start', marginTop: -35, marginLeft: 45, marginBottom: 10 }}>{j.created_on}</Text>
                          <TouchableOpacity onPress={() => this.openFriendPoll(j.id)}>
                            <View style={{ flexDirection: 'row' }}>
                              <Image
                                style={{
                                  height: 150,
                                  width: 145,
                                  marginRight: 5,
                                  marginLeft: 2,
                                  borderRadius: 5
                                }}
                                resizeMode='cover'
                                source={{ uri: j.options[0].option_image_url }}
                              />
                              <Image
                                style={{
                                  height: 150,
                                  width: 145,
                                  borderRadius: 5
                                }}
                                resizeMode='cover'
                                source={{ uri: j.options[1].option_image_url }}
                              />
                            </View>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#242632' }}>{j.description}</Text>
                          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#9B9B9B' }}>This poll will end in {j.expiration.days} days</Text>
                          <View style={{ flexDirection: 'row' }}>
                            <Icon
                              type='octicon'
                              size={20}
                              name='comment-discussion'
                              color='#FC3838'
                              containerStyle={{
                                marginTop: 10,
                                alignSelf: 'flex-start'
                              }}
                            />
                            <Text style={{ marginLeft: 10, marginTop: 9, fontWeight: 'bold', marginRight: 180 }}>37</Text>
                            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                              {
                                j.members.map((u, i) => {
                                  if (j.members.length > 3) {
                                    if (i >= 2) {
                                      return false;
                                    }
                                    else {
                                      return (
                                        <View key={i}>
                                          <Image
                                            style={{
                                              height: 25,
                                              width: 25,
                                              borderRadius: 25,
                                              alignSelf: 'flex-end',
                                              borderColor: 'white',
                                              borderWidth: 1,
                                              marginLeft: -10
                                            }}
                                            resizeMode='cover'
                                            source={require('../../../Images/SampleStockPhotos/stock1.jpg')}
                                          />
                                        </View>
                                      );
                                    }
                                  }
                                  else {
                                    return (
                                      <View key={i}>
                                        <Image
                                          style={{
                                            height: 25,
                                            width: 25,
                                            borderRadius: 25,
                                            alignSelf: 'flex-end',
                                            borderColor: 'white',
                                            borderWidth: 1
                                          }}
                                          resizeMode='cover'
                                          source={require('../../../Images/SampleStockPhotos/stock1.jpg')}
                                        />
                                      </View>
                                    );
                                  }
                                })

                              }
                              {renderIf(j.members.length >= 3)(
                                <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                                  <View style={{
                                    height: 25,
                                    width: 25,
                                    marginTop: 5,
                                    borderRadius: 25,
                                    backgroundColor: '#FD3F36',
                                  }}>
                                    <Text style={{ color: 'white', marginLeft: 4, marginTop: 2, fontSize: 13, fontWeight: 'bold' }}>+{(j.members.length) - 2 + 1}</Text>
                                  </View>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })
                  }
                </Card>
                <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>EDIT POLL</Text>}
                  options={options}
                  cancelButtonIndex={3}
                  destructiveButtonIndex={3}
                  onPress={(index) => {
                    if (index == 0) {
                      this.getUserData(this.state.userID, this.state.accessToken, index)
                    }
                    else if (index == 1) {
                      this.getUserData(this.state.userID, this.state.accessToken, index)
                    }
                    else if (index == 2) {
                      this.getUserData(this.state.userID, this.state.accessToken, index)
                    }
                  }}
                />
              </View>
            )}
            {/* Loading Modal */}
            <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
              <View>
                <Bars size={20} color="#FC3838" />
              </View>
            </Modal>
          </ScrollView>
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
          <ScrollView style={styles.mainContainerProfile}>
            <View style={styles.mainProfileHeader}>
              {/* Header User Profile Image And Edit Button */}

              {/* If User Image Is Null, Showing Default Image */}
              {renderIf(this.state.userProfileImage == null)(
                <View>
                  <Image
                    style={{
                      marginTop: 20,
                      height: 120,
                      width: 120,
                      borderRadius: 65
                    }}
                    resizeMode='cover'
                    source={require('../../../Images/Icons/Avatar.png')}
                  />
                </View>
              )}
              {/* If User Image Is Not Null, Showing User Image */}
              {renderIf(this.state.userProfileImage != null)(
                <View>
                  <Image
                    style={{
                      marginTop: 20,
                      height: 120,
                      width: 120,
                      borderRadius: 65
                    }}
                    resizeMode='cover'
                    source={{ uri: this.state.userProfileImage }}
                  />
                  {/* <View style={{ backgroundColor: '#FC3838', padding: 5, borderRadius: 25, width: 30, alignSelf: 'flex-end', marginTop: -30 }}>
                  <Icon
                    type='font-awesome'
                    size={20}
                    name='edit'
                    color='white'
                    onPress={() => this.props.navigation.navigate('EditProfileScreen', {
                      userFullName: this.state.userFullName,
                      userAvatar: this.state.userProfileImage,
                      userDescription: this.state.userDescription,
                      userInterests: this.state.userInterests
                    })
                    }
                  />
                </View> */}
                </View>
              )}
            </View>
            {/* User Display Name */}
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.userFullName}>{this.state.userFullName}</Text>
            </View>
            {/* UserName Display */}
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.userNameDisplay}>@{this.state.userNameDisplay}</Text>
            </View>
            {/* User Description Display */}
            <View style={{ alignSelf: 'flex-start' }}>
              <Text style={{ marginTop: 30, fontWeight: 'bold', fontSize: 17 }}>About</Text>
              <Text style={styles.userNameDisplay}>{this.state.userAbout}</Text>
            </View>
            {/* User Interests Display */}
            {renderIf(this.state.userFriendInterests != null && this.state.userFriendInterests != undefined)(
              <View>
                <Text style={{ alignSelf: 'flex-start', color: 'black', marginTop: 20 }}>
                  Interests
              </Text>
                <ScrollView style={{ flexDirection: 'row', marginTop: 10, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                  {
                    this.state.userFriendInterests.map((j, k) => {
                      return (
                        <View key={j.user_interest_id}>
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
            )}
            {renderIf(this.state.invitationStatus == 'Uninvited')(
              <View>
                <TouchableOpacity style={styles.addFriendButton} onPress={() => this.addFriend(this.state.otherUserID)}>
                  <LinearGradient
                    colors={['#FC3838', '#F52B43', '#ED0D51']}
                    start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                    style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
            {renderIf(this.state.invitationStatus == 'Invited')(
              <View>
                <TouchableOpacity style={styles.addFriendButton} onPress={() => this.deleteInvitation(this.state.otherUserID)}>
                  <LinearGradient
                    colors={['#FC3838', '#F52B43', '#ED0D51']}
                    start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                    style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>CANCEL INVITATION</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
            {/* Loading Modal */}
            <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
              <View>
                <Bars size={20} color="#FC3838" />
              </View>
            </Modal>
          </ScrollView>
        </View>
      )
    }
  }
}