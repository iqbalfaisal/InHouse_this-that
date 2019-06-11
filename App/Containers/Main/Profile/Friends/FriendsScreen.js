import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button, RefreshControl } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import renderIf from '../../../CustomComponents/RenderIf/renderIf'
import moment from 'moment';
// Styles
import styles from './FriendsScreenStyle'

export default class FriendsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      friends: [],
      refreshing: false,
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
    console.log('Friends Screen')
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  retrieveDataGlobalDetails = async (getValue) => {
    this.refs.modal3.open()
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getUserFriends(value2, value)
    }
    catch (error) { }
  }
  getUserFriends = (userID, accessToken) => {
    console.log('get user friends is called dsadasdasd')
    console.log(userID)
    console.log(accessToken)
    const api = API.create();
    const headers = {
      'access_token': accessToken,
      'user_id': userID,
      'Content-Type': 'application/json'
    }
    api.getAllUserInformation(headers, this.state.userID,moment().utc().format('YYYY-MM-DD HH:mm:ss') ,'All')
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.refs.modal3.close()
          this.setState({ friends: response.data.friends.data })
          //console.log(this.state.friends)
        }
        else{
          console.log(response)
          this.refs.modal3.close()
        }
      })
      .catch(error => {
        console.log(error)
        this.refs.modal3.close()
      })
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getUserFriends(this.state.userID, this.state.accessToken)
    this.setState({ refreshing: false });
  }
  onPressCard = (clickedUserID, otherUserProfileName) => {
    this.props.navigation.navigate('ViewUserProfileScreen', {
      otherUserID: clickedUserID,
      otherUserProfileName: otherUserProfileName
    })
  }
  addFriend() {
    this.resetNavigation('SearchScreen');
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerFriends} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
          <View>
            {
              this.state.friends.map((u, i) => {
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
                      <Text style={styles.username}>@{u.user_name}</Text>
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
          {/* <View>
            <TouchableOpacity style={styles.addFriendButton} onPress={() => this.props.navigation.navigate('Search')}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD A FRIEND</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.viewPendingRequests} onPress={()=>this.props.navigation.navigate('ViewPendingRequestsScreen')}>View pending requests</Text>
          </View> */}
          {/* Loading Modal */}
          <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} isDisabled={this.state.isDisabled} coverScreen={true} backdropPressToClose={false}>
            <View>
              <Bars size={20} color="#FC3838" />
            </View>
          </Modal>
        </ScrollView>
        <Text style={styles.viewPendingRequests} onPress={() => this.props.navigation.navigate('ViewPendingRequestsScreen')}>View pending requests</Text>
      </View>
    )
  }
}