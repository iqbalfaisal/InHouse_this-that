import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import ViewMyPollsFromHomeScreen from '../Containers/Main/Home/ViewMyPollsFromHomeScreen/ViewMyPollsFromHomeScreen'
import ViewPollScreen from '../Containers/Main/ViewPoll/ViewPollScreen'
import InviteFriendsOnPollScreen from '../Containers/Main/CreatePoll/InviteFriendsOnPoll/InviteFriendsOnPollScreen'
import CreatePollScreen from '../Containers/Main/CreatePoll/CreatePollScreen'
import ViewPendingRequestsScreen from '../Containers/Main/Profile/ViewPendingRequests/ViewPendingRequestsScreen'
import FriendsScreen from '../Containers/Main/Profile/Friends/FriendsScreen'
import MyPollsScreen from '../Containers/Main/Profile/MyPolls/MyPollsScreen'
import NotificationsScreen from '../Containers/Main/Notifications/NotificationsScreen'
import ViewUserProfileScreen from '../Containers/Main/UserProfile/ViewUserProfileScreen'
import ViewAllInterestsScreen from '../Containers/Main/EditProfile/ViewInterests/ViewAllInterestsScreen'
import EditProfileScreen from '../Containers/Main/EditProfile/EditProfileScreen'
import DefaultInterestsScreen from '../Containers/Auth/Interests/DefaultInterestsScreen'
import ForgotPasswordNewPasswordScreen from '../Containers/Auth/NewPassword-Setup/ForgotPasswordNewPasswordScreen'
import ForgotPasswordVerifyScreen from '../Containers/Auth/ForgotPassword-Verify/ForgotPasswordVerifyScreen'
import ForgotPasswordScreen from '../Containers/Auth/ForgotPassword/ForgotPasswordScreen'
import ProfileScreen from '../Containers/Main/Profile/ProfileScreen'
import SearchScreen from '../Containers/Main/Search/SearchScreen'
import MainScreen from '../Containers/Main/MainTabs/MainScreen'
import HomeScreen from '../Containers/Main/Home/HomeScreen'
import RegisterScreen from '../Containers/Auth/Register/RegisterScreen'
import LoginScreen from '../Containers/Auth/Login/LoginScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import { ScrollView, Text, KeyboardAvoidingView, View, Image, TouchableOpacity, Picker, Alert,ToastAndroid} from 'react-native'
import { Header, Icon, Card, Button, Badge } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialIcons';
// import ActionSheet from 'react-native-actionsheet-native';
import ActionSheet from 'react-native-actionsheet'
import renderIf from '../Containers/CustomComponents/RenderIf/renderIf'
import { NavigationActions } from 'react-navigation'
import SplashScreen from '../Containers/SplashScreen/SplashScreen'
import { AsyncStorage } from 'react-native'
import API from '../Services/Api'
import moment from 'moment';

import styles from './Styles/NavigationStyles'
var isMute = false;
var pollEditTest = false;
const options = [
  <Feather name='volume-2' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>MUTE NOTIFICATIONS</Text></Feather>,
  <Feather name='user-plus' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>INVITE A FRIEND TO APP</Text></Feather>,
  <Feather name='shield' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CHANGE PASSWORD</Text></Feather>,
  <Feather name='star' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>RATE AND REVIEW</Text></Feather>,
  <Feather name='info' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>ABOUT US</Text></Feather>,
  <Feather name='log-out' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>LOG OUT</Text></Feather>,
  <Feather name='x-circle' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
const options2 = [
  <Feather name='volume-x' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>UN-MUTE NOTIFICATIONS</Text></Feather>,
  <Feather name='user-plus' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>INVITE A FRIEND TO APP</Text></Feather>,
  <Feather name='shield' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CHANGE PASSWORD</Text></Feather>,
  <Feather name='star' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>RATE AND REVIEW</Text></Feather>,
  <Feather name='info' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>ABOUT US</Text></Feather>,
  <Feather name='log-out' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>LOG OUT</Text></Feather>,
  <Feather name='x-circle' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
const optionsViewPoll = [
  <Feather name='edit' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>EDIT POLL</Text></Feather>,
  <Feather name='power' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>END POLL</Text></Feather>,
  <Feather name='trash' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>REMOVE POLL</Text></Feather>,
  <Feather name='x-circle' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
const optionsViewAllMyPolls = [
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>VIEW ALL</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>ACTIVE</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>IN-ACTIVE</Text></Feather>,
  <Feather name='' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  ViewMyPollsFromHomeScreen: {
    screen: ViewMyPollsFromHomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.dispatch(NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MainScreen' })
                  ]
                }))}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>My Polls</Text>
          }
          rightComponent={
            <View>
              <Icon
                type='material-community'
                size={25}
                name='filter-variant'
                color='#FC3838'
                onPress={() => {
                  this.ActionSheet.show()
                }}
              />
              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>EDIT POLL</Text>}
                options={optionsViewAllMyPolls}
                cancelButtonIndex={3}
                destructiveButtonIndex={3}
                onPress={(index) => {
                  if (index == 0) {
                    navigation.navigate('ViewMyPollsFromHomeScreen', {
                      actionValue: index,
                    })
                  }
                  else if (index == 1) {
                    navigation.navigate('ViewMyPollsFromHomeScreen', {
                      actionValue: index,
                    })
                  }
                  else if (index == 2) {
                    navigation.navigate('ViewMyPollsFromHomeScreen', {
                      actionValue: index,
                    })
                  }
                }}
              />
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  ViewPollScreen: {
    screen: ViewPollScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.dispatch(NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MainScreen' })
                  ]
                }))}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Poll Details</Text>
          }
          rightComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-more'
                color='#FC3838'
                containerStyle={{
                  marginRight: 10
                }}
                onPress={() => {
                  this.ActionSheet.show()
                }}
              />
              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>EDIT POLL</Text>}
                options={optionsViewPoll}
                cancelButtonIndex={3}
                destructiveButtonIndex={3}
                onPress={(index) => {
                  console.log('index value : ', index)
                  if (index == 0) {
                    const viewPollID = navigation.getParam('viewPollID');
                    console.log('edit poll id : ', viewPollID)
                    navigation.navigate('CreatePollScreen', {
                      viewPollID: viewPollID,
                    })
                  }
                  else if (index == 1) {
                    Alert.alert(
                      'End Poll',
                      'Are you sure you want to end this poll? This cannot be undone',
                      [
                        {
                          text: 'CANCEL',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK', onPress: async () => {
                            // (headers,pollID,currentDate)
                            console.log('end poll')
                            const viewPollID = navigation.getParam('viewPollID');
                            // const value = navigation.getParam('userToken');
                            // const value2 = navigation.getParam('userId');
                            // console.log('check this user id :',value2)
                            // console.log('check this user token :',value)
                            const api = API.create();
                            const headers = {
                              'access_token': await AsyncStorage.getItem('userTokenGlobal'),
                              'user_id': await AsyncStorage.getItem('userIDGlobal'),
                              'Content-Type': 'application/json'
                            }
                            api.endPoll(headers, viewPollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
                              .then(response => {
                                console.log(response)
                                if (response.status == 200) {
                                  navigation.dispatch(NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                      NavigationActions.navigate({ routeName: 'MainScreen' })
                                    ]
                                  }))
                                }
                                else {
                                  console.log(response)
                                  ToastAndroid.show('Could not end poll, please try again later', ToastAndroid.LONG);
                                }
                              })
                              .catch(error => {
                                console.log(error)
                                ToastAndroid.show('Could not end poll, please try again later', ToastAndroid.LONG);
                              })
                          }
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                  else if (index == 2){
                    //remove poll here
                  }
                }}
              />
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  InviteFriendsOnPollScreen: {
    screen: InviteFriendsOnPollScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Invite Friends</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  CreatePollScreen: {
    screen: CreatePollScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{navigation.getParam('viewPollID') ? 'Edit Poll' : 'Create a Poll'}</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  ViewPendingRequestsScreen: {
    screen: ViewPendingRequestsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Pending Requests</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  FriendsScreen: {
    screen: FriendsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Your Friends</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  MyPollsScreen: { screen: MyPollsScreen },
  NotificationsScreen: {
    screen: NotificationsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>
          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Notifications</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  ViewUserProfileScreen: {
    screen: ViewUserProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>

          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{navigation.getParam('otherUserProfileName')}</Text>
          }
          rightComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-more'
                color='#FC3838'
                containerStyle={{
                  marginRight: 10
                }}
                onPress={() => {
                  //this.ActionSheet.show()
                }}
              />
              {/* <ActionSheet
              ref={o => this.ActionSheet = o}
              title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>EDIT POLL</Text>}
              options={optionsViewPoll}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={(index) => {
                if (index == 0) {
                  const viewPollID = navigation.getParam('viewPollID');
                  console.log('edit poll id : ', viewPollID)
                  navigation.navigate('CreatePollScreen', {
                    viewPollID: viewPollID,
                  })
                }
              }}
            /> */}
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  ViewAllInterestsScreen: {
    screen: ViewAllInterestsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>
          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Interests</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  EditProfileScreen: {
    screen: EditProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>
          }
          centerComponent={
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Edit Profile</Text>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  DefaultInterestsScreen: {
    screen: DefaultInterestsScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  ForgotPasswordNewPasswordScreen: { screen: ForgotPasswordNewPasswordScreen },
  ForgotPasswordVerifyScreen: { screen: ForgotPasswordVerifyScreen },
  ForgotPasswordScreen: { screen: ForgotPasswordScreen },
  ProfileScreen: { screen: ProfileScreen },
  SearchScreen: { screen: SearchScreen },
  MainScreen: {
    screen: MainScreen,
    navigationOptions: ({ navigation }) => ({
      header: <View>
        <Header
          leftComponent={
            <View>
              <Feather name='settings' size={25} color='#FC3838' onPress={() => {
                this.ActionSheet.show()
              }} />
              {renderIf(isMute == false)(
                <View>
                  <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>SETTINGS</Text>}
                    options={options}
                    cancelButtonIndex={5}
                    destructiveButtonIndex={1}
                    onPress={(index) => {
                      if (index == 0) {
                        isMute = true;
                      }
                    }}
                  />
                </View>
              )}
              {renderIf(isMute == true)(
                <View>
                  <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>SETTINGS</Text>}
                    options={options2}
                    cancelButtonIndex={6}
                    destructiveButtonIndex={6}
                    onPress={(index) => {
                      if (index == 5) {
                        try {
                          AsyncStorage.removeItem('userTokenGlobal');
                          navigation.dispatch(NavigationActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: 'LoginScreen' })
                            ]
                          }))
                          return true;
                        }
                        catch (exception) {
                          return false;
                        }
                      }
                    }}
                  />
                </View>
              )}
              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>SETTINGS</Text>}
                options={options}
                cancelButtonIndex={6}
                destructiveButtonIndex={6}
                onPress={(index) => {
                  console.log('index is ', index)
                  if (index == 0) {
                    isMute = true;
                    console.log('index is ', index)
                    //this.setState({isMute : true})
                  }
                  else if (index == 5) {
                    try {
                      AsyncStorage.removeItem('userTokenGlobal');
                      navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'LoginScreen' })
                        ]
                      }))
                      return true;
                    }
                    catch (exception) {
                      return false;
                    }
                  }
                }}
              />
            </View>

          }
          centerComponent={
            <Image
              style={{
                marginTop: 5,
                height: 40,
                width: 40
              }}
              resizeMode='cover'
              source={require('../Images/Icons/main-app-logo.png')}
            />
          }
          rightComponent={
            <Material name='notifications-none' size={28} color='#FC3838' onPress={() => navigation.navigate('NotificationsScreen')} />
          }
          containerStyle={{
            backgroundColor: 'white',
            justifyContent: 'space-around',
            borderBottomWidth: 0,
          }}
        />
      </View>
    })
  },
  HomeScreen: { screen: HomeScreen },
  RegisterScreen: {
    screen: RegisterScreen,
    navigationOptions: ({ navigation }) => ({
      // headerTintColor: '#FC3838',
      // headerStyle: {
      //   position: 'absolute',
      //   backgroundColor: 'transparent',
      //   zIndex: 100,
      //   top: 0,
      //   left: 0,
      //   right: 0
      // }
      header: <View>
        <Header
          leftComponent={
            <View>
              <Icon
                type='ionicon'
                size={25}
                name='md-arrow-back'
                color='#FC3838'
                containerStyle={
                  {
                    marginLeft: 8
                  }
                }
                onPress={() => navigation.goBack(null)}
              />
            </View>
          }
          centerComponent={
            <View>
            </View>
          }
          rightComponent={
            <View>
            </View>
          }
          containerStyle={{
            backgroundColor: 'white',
            borderBottomWidth: 0,
            marginTop: -10
          }}
        />
      </View>
    })
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  LaunchScreen: { screen: LaunchScreen }
}, {
    // Default config for all screens
    //headerMode: 'none',
    initialRouteName: 'SplashScreen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0
      }
    }
  })

export default PrimaryNav
