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
import Feather from 'react-native-vector-icons/Feather';
import renderIf from '../../CustomComponents/RenderIf/renderIf'



// Styles
import styles from './SearchScreenStyle'

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      searchKey: '',
      searchstatus: false,
      searchResultContacts: [],
      searchResultInvited: [],
      searchResultOthers: []
    };
  }
  componentDidMount() {
    console.log('Search User Screen')
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      //this.getUserData(value2, value)
    }
    catch (error) { }
  }
  inviteContact = (user_id) => {
    console.log('invited user id ' + user_id)
    console.log('current user id ' + this.state.userID)
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.addFriend(headers, this.state.userID, user_id)
      .then(response => {
        console.log("invitecontact")
        console.log(response)
        if (response.status == 200) {
          console.log(this.state.searchKey)
          this.onSearchQuery(this.state.searchKey)
          ToastAndroid.show('Invitation sent successfully', ToastAndroid.LONG);
        }
      })
      .catch(error => {

      })
  }
  deleteInvitation = (user_id) =>{
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
          console.log(this.state.searchKey)
          this.onSearchQuery(this.state.searchKey)
          ToastAndroid.show('Invitation deleted successfully', ToastAndroid.LONG);
        }
      })
      .catch(error => {

      })
  }
  onSearchQuery = (query) => {
    if (query != '') {
      const api = API.create()
      const headers = {
        'access_token': this.state.accessToken,
        'user_id': this.state.userID
      }
      api.searchUser(headers, this.state.userID, query).then(response => {
        console.log(response)
        this.setState({ searchResultInvited: response.data.data.others.invited })
        this.setState({ searchResultOthers: response.data.data.others.uninvited })
        this.setState({ searchResultContacts: response.data.data.contacts })
        this.setState({ searchstatus: true })
      }).catch(error => {
        console.log(error)
      });
    }
    else {
      console.log('empty search string')
    }
  }
  onPressCard = (clickedUserID,otherUserProfileName)=>{
    this.props.navigation.navigate('ViewUserProfileScreen', {
      otherUserID: clickedUserID,
      otherUserProfileName : otherUserProfileName
    })
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerSearch}>
          <View style={styles.searchSection}>
            <Feather name='search' size={23} color='#FC3838' style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search.."
              onChangeText={(searchString) => { this.setState({ searchKey: searchString }); this.onSearchQuery(searchString) }}
              underlineColorAndroid="transparent"
            >
            </TextInput>
          </View>
          <View style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 30 }}>
            <Text style={{ textAlign: 'center', color: '#424242' }}>Search for users here</Text>
          </View>
          {renderIf(this.state.searchstatus == true)(
            <View>
              <Text style={{fontSize : 12, fontWeight : 'bold', alignSelf : 'flex-start', marginTop : 15}}>Contacts</Text>
              <Card containerStyle={{height : 80}}>
                {
                  this.state.searchResultContacts.map((u, i) => {
                    return (
                      <View key={u.id} style={styles.mainCard}>
                        <TouchableOpacity onPress={() => this.onPressCard(u.id,u.full_name)} style={styles.cardTouchableOpacity}>
                          <View style={styles.cardView}>
                            <Image
                              style={styles.image}
                              resizeMode="cover"
                              source={require('../../../Images/Icons/Avatar.png')}
                            />
                            <Text style={styles.name}>{u.full_name}</Text>
                          </View>
                        </TouchableOpacity>
                        <Text style={styles.username}>{u.user_name}</Text>
                      </View>
                    );
                  })
                }
              </Card>
              <Text style={{fontSize : 12, fontWeight : 'bold', alignSelf : 'flex-start', marginTop : 15}}>Others</Text>
              <Card containerStyle={{height : 80}}>
                {
                  this.state.searchResultOthers.map((u, i) => {
                    return (
                      <View key={u.id} style={styles.mainCard}>
                        <TouchableOpacity onPress={() => this.onPressCard(u.id,u.full_name)} style={styles.cardTouchableOpacity}>
                        <View style={styles.cardView}>
                          <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={require('../../../Images/Icons/Avatar.png')}
                          />
                          <Text style={styles.name}>{u.full_name}</Text>

                          {/* <TouchableOpacity style={styles.inviteButton} onPress={() => this.inviteContact(u.id)}>
                            <Feather name='user-plus' size={18} color='white' style={{
                              marginTop: 8,
                              backgroundColor: '#FC3838',
                              borderRadius: 25,
                              padding: 8
                            }} />
                          </TouchableOpacity> */}
                          {/* <Button transparent title="INVITE" style={styles.inviteButton} accessibilityLabel="Invite this person to add to your contacts"></Button> */}
                        </View>
                        </TouchableOpacity>
                        <Text style={styles.username}>{u.user_name}</Text>
                      </View>
                    );
                  })
                }
              </Card>
              <Text style={{fontSize : 12, fontWeight : 'bold', alignSelf : 'flex-start', marginTop : 15}}>Invited</Text>
              <Card containerStyle={{height : 80}}>
                {
                  this.state.searchResultInvited.map((u, i) => {
                    return (
                      <View key={u.id} style={styles.mainCard}>
                        <TouchableOpacity onPress={() => this.onPressCard(u.id,u.full_name)} style={styles.cardTouchableOpacity}>
                        <View style={styles.cardView}>
                          <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={require('../../../Images/Icons/Avatar.png')}
                          />
                          <Text style={styles.name}>{u.full_name}</Text>
                          {/* <TouchableOpacity style={styles.inviteButton} onPress={() => this.deleteInvitation(u.id)}>
                            <Feather name='user-check' size={18} color='white' style={{
                              marginTop: 8,
                              backgroundColor: '#FC3838',
                              borderRadius: 25,
                              padding: 8
                            }} />
                          </TouchableOpacity> */}
                          {/* <Button title="SENT" style={styles.inviteButton} accessibilityLabel="Invite this person to add to your contacts" disabled></Button> */}
                        </View>
                        </TouchableOpacity>
                        <Text style={styles.username}>{u.user_name}</Text>
                      </View>
                    );
                  })
                }
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}
