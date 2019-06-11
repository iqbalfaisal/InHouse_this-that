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
import { Header, Icon, Card, Badge, Avatar } from 'react-native-elements'
import renderIf from '../../CustomComponents/RenderIf/renderIf'
import { BackHandler } from 'react-native'
import { TabNavigator, TabBarBottom, TabBarTop } from "react-navigation";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'

const options = [
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>VIEW ALL</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>VOTED</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>UN-VOTED</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
const optionsOnFriendPoll = [
  <Feather name='eye-off' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>HIDE POLL</Text></Feather>,
  <Feather name='bell-off' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>UN-NOTIFY ME</Text></Feather>,
  <Feather name='x-circle' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
// Styles
import styles from './HomeScreenStyle'

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      myPolls: [],
      pollsAddedTo: [],
      pollOptions: [],
      userPollProfilePic: '',
      userPollUserName: '',
      userPollCreatedOn: '',
      userPollDescription: '',
      userPollExpirationDays: '',
      userPollImage1: '',
      userPollImage2: '',
      pollID: '',
      pollComments: [],
      noPollFoundCheck: boolean = false,
      noUserPollFoundCheck: boolean = false,
      refreshing: false,
      pollIDFriendSetting : ''
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentDidMount(this)
    this.setState({ refreshing: false });
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
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    this.resetNavigation('MainScreen')
    return true;
  }
  componentDidMount() {
    console.log('Home Screen')
    // console.log(moment().utc().format('YYYY-MM-DD HH:mm:ss'))
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getDetails(value2, value, 0)
    }
    catch (error) { }
  }
  getDetails = (userID, accessToken, filterValue) => {
    this.refs.modal3.open()
    const api = API.create();
    const headers = {
      'access_token': accessToken,
      'user_id': userID
    }
    api.homeScreenData(headers, userID, moment().utc().format('YYYY-MM-DD HH:mm:ss'), filterValue)
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.setState({ pollsAddedTo: response.data.polls_user_added_to })
          if (this.state.pollsAddedTo.length <= 0) {
            this.setState({ noUserPollFoundCheck: true })
          }
          this.setState({ myPolls: response.data.recent_poll_by_user })
          if (response.data.recent_poll_by_user == 'No polls found') {
            this.setState({ noPollFoundCheck: true })
          }
          this.setState({ userPollProfilePic: this.state.myPolls.profile_pic })
          this.setState({ userPollCreatedOn: this.state.myPolls.created_on })
          this.setState({ userPollDescription: this.state.myPolls.description })
          this.setState({ userPollUserName: this.state.myPolls.user_name })
          this.setState({ userPollExpirationDays: this.state.myPolls.expiration.days })
          this.setState({ pollID: this.state.myPolls.id })
          this.setState({ pollComments: this.state.myPolls.comments })
          this.setState({ userPollImage1: this.state.myPolls.options[0].option_image_url })
          this.setState({ userPollImage2: this.state.myPolls.options[1].option_image_url })
          this.refs.modal3.close()
        }
        else {
          this.refs.modal3.close()
        }
      })
      .catch(error => {
        this.refs.modal3.close()
      })
  }
  openPoll = (pollID) => {
    this.props.navigation.navigate('ViewPollScreen', {
      viewPollID: pollID
    })
  }
  hideOrNotifyPoll = (pollID,notificationValue,hidePollValue) => {
    console.log('poll id to hide : ',pollID),
    console.log('poll hide value : ',hidePollValue)
    // (headers,userID,pollID,notificationValue,hidePollValue,currentDate)
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.updateViewOnFriendsPoll(headers, this.state.userID, pollID, notificationValue, hidePollValue, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.componentDidMount(this)
        }
        else {
          ToastAndroid.show('Could not complete action, try again', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        console.log(error)
        ToastAndroid.show('Could not complete action, try again', ToastAndroid.LONG);
      })
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerHome} showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
          <View>
            <Header
              leftComponent={
                <Text style={{ color: '#FC3838', fontWeight: 'bold' }}>My Polls</Text>
              }
              centerComponent={
                <View />
              }
              rightComponent={
                <Text style={{ color: '#FC3838', fontWeight: 'bold' }} onPress={() => this.props.navigation.navigate('ViewMyPollsFromHomeScreen')}>View all</Text>
              }
              containerStyle={{
                backgroundColor: 'white',
                justifyContent: 'space-around',
                borderBottomWidth: 0,
              }}
            />
            {renderIf(this.state.noPollFoundCheck == true)(
              <View style={{ alignSelf: 'center', }}>
                <Image
                  style={{
                    marginTop: -100,
                    marginBottom: -100
                  }}
                  resizeMode='center'
                  source={require('../../../Images/EmptyStatsImages/emptyCard.png')}
                />
                <Text style={{ color: '#757575', alignSelf: 'center', textAlign: 'center', flexWrap: 'wrap' }}> Your most recent active poll will appear here, go ahead and create one</Text>
              </View>
            )}
            {renderIf(this.state.noPollFoundCheck == false)(
              <View>
                <Card containerStyle={{
                  shadowColor: 'rgba(252, 56, 56, 0.2)',
                  shadowOpacity: 0.5,
                  elevation: 1,
                  shadowRadius: 10,
                  shadowOffset: { width: 1, height: 3 },
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  marginBottom: 20,
                  marginLeft: 10,
                  marginRight: 10
                }}>
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
                          source={{ uri: this.state.userPollProfilePic }}
                        />
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FC3838', alignSelf: 'flex-start', marginTop: 5, marginLeft: 5 }}>{this.state.userPollUserName}</Text>
                      </View>
                      {/* <View style={{ flexDirection: 'row', position: 'absolute', right: 0 }}>
                        <Icon
                          type='ionicon'
                          size={20}
                          name='md-more'
                          color='#FC3838'
                          containerStyle={{
                            marginTop: 5
                          }}
                        />
                      </View> */}
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#87888F', alignSelf: 'flex-start', marginTop: -35, marginLeft: 45, marginBottom: 10 }}>{this.state.userPollCreatedOn}</Text>
                    <TouchableOpacity onPress={() => this.openPoll(this.state.pollID)} style={{ alignSelf: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={{
                            height: 150,
                            width: 160,
                            marginRight: 5,
                            marginLeft: 2,
                            borderRadius: 5
                          }}
                          resizeMode='cover'
                          source={{ uri: this.state.userPollImage1 }}
                        />
                        <Image
                          style={{
                            height: 150,
                            width: 160,
                            borderRadius: 5
                          }}
                          resizeMode='cover'
                          source={{ uri: this.state.userPollImage2 }}
                        />
                      </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#242632' }}>{this.state.userPollDescription}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#9B9B9B' }}>This poll will end in {this.state.userPollExpirationDays} days</Text>
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
                      <Text style={{ marginLeft: 10, marginTop: 9, fontWeight: 'bold', marginRight: 180 }}>{this.state.pollComments == false ? '0' : this.state.pollComments.length}</Text>
                      {/* <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                    {
                      this.state.myPolls.members && this.state.myPolls.members.map((u, i) => {
                        if (this.state.myPolls.members.length > 3) {
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
                    {renderIf(this.state.myPolls.members.length >= 3)(
                      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                        <View style={{
                          height: 25,
                          width: 25,
                          marginTop: 5,
                          borderRadius: 25,
                          backgroundColor: '#FD3F36',
                        }}>
                          <Text style={{ color: 'white', marginLeft: 4, marginTop: 2, fontSize: 13, fontWeight: 'bold' }}>+{(this.state.myPolls.members.length) - 2 + 1}</Text>
                        </View>
                      </View>
                    )}
                  </View> */}
                    </View>
                  </View>
                </Card>
              </View>
            )}
          </View>
          {/* All Polls Heading */}
          <View >
            <Header
              leftComponent={
                <Text style={{ color: '#FC3838', fontWeight: 'bold' }}>All Polls</Text>
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
            {renderIf(this.state.noUserPollFoundCheck == true)(
              <View style={{ alignSelf: 'center', }}>
                <Image
                  style={{
                    marginTop: -100,
                    marginBottom: -100
                  }}
                  resizeMode='center'
                  source={require('../../../Images/EmptyStatsImages/emptyCard.png')}
                />
                <Text style={{ color: '#757575', alignSelf: 'center', textAlign: 'center', flexWrap: 'wrap' }}> Your Friend's polls will appear here, go ahead and add some</Text>
              </View>
            )}
            {renderIf(this.state.noUserPollFoundCheck == false)(
              <View>
                {
                  this.state.pollsAddedTo && this.state.pollsAddedTo.map((j, k) => {
                    if (this.state.pollsAddedTo.length) {
                      return (
                        <Card containerStyle={{
                          shadowColor: 'rgba(252, 56, 56, 0.2)',
                          shadowOpacity: 0.5,
                          elevation: 1,
                          shadowRadius: 10,
                          shadowOffset: { width: 1, height: 3 },
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          marginBottom: 20,
                          marginLeft: 10,
                          marginRight: 10
                        }}>
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
                                  onPress={() => {
                                    this.ActionSheet2.show()
                                    this.setState({pollIDFriendSetting : j.id})
                                  }}
                                />
                              </View>
                              <ActionSheet
                                ref={o => this.ActionSheet2 = o}
                                title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>POLL PREFERENCES</Text>}
                                options={optionsOnFriendPoll}
                                cancelButtonIndex={2}
                                destructiveButtonIndex={2}
                                onPress={(index) => {
                                  console.log(index)
                                  if (index == 0) {
                                    //hide poll here
                                    this.hideOrNotifyPoll(this.state.pollIDFriendSetting,'True', 'True')
                                  }
                                  else if (index == 1) {
                                    //Notification Toggle On Poll
                                    this.hideOrNotifyPoll(this.state.pollIDFriendSetting,'False', 'False')
                                  }
                                  else if (index == 2) {
                                    //this.getDetails(this.state.userID, this.state.accessToken, 2)
                                  }
                                }}
                              />
                            </View>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#87888F', alignSelf: 'flex-start', marginTop: -35, marginLeft: 45, marginBottom: 10 }}>{j.created_on}</Text>
                            <TouchableOpacity onPress={() => this.openPoll(j.id)} style={{ alignSelf: 'center' }}>
                              <View style={{ flexDirection: 'row' }}>
                                <Image
                                  style={{
                                    height: 150,
                                    width: 160,
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
                                    width: 160,
                                    borderRadius: 5
                                  }}
                                  resizeMode='cover'
                                  source={{ uri: j.options[1].option_image_url }}
                                />
                              </View>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#242632' }}>{j.description}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#9B9B9B' }}>{j.status == 'Inactive' ? 'This poll has ended' : `This poll will end in ${j.expiration.days} days`}</Text>
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
                              <Text style={{ marginLeft: 10, marginTop: 9, fontWeight: 'bold', marginRight: 180 }}>{j.comments == false ? '0' : j.comments.length}</Text>
                              {/* <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                                {
                                  j.members && j.members.map((u, i) => {
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
                              </View> */}
                            </View>
                          </View>
                        </Card>
                      )
                    }
                    else if (this.state.pollsAddedTo.length <= 0) {
                      return (
                        <View>
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
                          }}
                            title="No Polls">
                            <View>
                              <Text></Text>
                            </View>
                          </Card>
                        </View>
                      )
                    }
                  })
                }
              </View>
            )}
            <View>
              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>FILTER POLLS</Text>}
                options={options}
                cancelButtonIndex={3}
                destructiveButtonIndex={3}
                onPress={(index) => {
                  console.log(index)
                  if (index == 0) {
                    this.getDetails(this.state.userID, this.state.accessToken, 0)
                  }
                  else if (index == 1) {
                    this.getDetails(this.state.userID, this.state.accessToken, 1)
                  }
                  else if (index == 2) {
                    this.getDetails(this.state.userID, this.state.accessToken, 2)
                  }
                }}
              />
            </View>
          </View>
          {/* Loading Modal */}
          <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
            <View>
              <Bars size={20} color="#FC3838" />
            </View>
          </Modal>
        </ScrollView>
        <ActionButton
          size={100}
          width={40}
          onPress={() => this.props.navigation.navigate('CreatePollScreen')}
          buttonColor="#FC3838"
          icon={
            <View style={{ flexDirection: 'row' }}>
              <Feather name='plus' size={20} color='white' style={{ marginRight: 10 }} />
              <Text style={{ color: 'white', alignSelf: 'stretch', fontSize: 15 }}>Create new</Text>
            </View>
          }
        />
      </View>
    )
  }
}
