import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button } from 'react-native'
import { ToastAndroid } from 'react-native'
import API from '../../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import renderIf from '../../../CustomComponents/RenderIf/renderIf'

// Styles
import styles from './ViewPendingRequestsScreenStyle'

export default class ViewPendingRequestsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      pendingRequests: [],
      invitationStatus: boolean = false
    };
  }
  componentDidMount() {
    console.log('Notification Screen')
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  retrieveDataGlobalDetails = async (getValue) => {
    this.refs.modal3.open()
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getUserData(value2, value)
    }
    catch (error) { }
  }
  getUserData = (user_id, access_token) => {
    console.log(user_id)
    console.log(access_token)
    const api = API.create()
    const headers = {
      'access_token': access_token,
      'user_id': user_id
    }
    api.getAllRequestsOfUser(headers, user_id).then(response => {
      console.log(response)
      if (response.status == 200) {
        this.setState({ pendingRequests: response.data.data })
        this.setState({ invitationStatus: true })
        this.refs.modal3.close()
      }
      else if (response.status == 400) {
        this.setState({ invitationStatus: false })
        this.refs.modal3.close()
      }
    }).catch(error => {
      console.log(error)
      this.refs.modal3.close()
    });
  }
  acceptDeclineUserRequest = (typeId, status) => {
    const api = API.create()
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    api.userAcceptOrDeclineRequest(headers, typeId, status).then(response => {
      console.log(response)
      if (response.status == 200) {
        ToastAndroid.show(`User Request ${response.data.status}`, ToastAndroid.LONG);
        this.getUserData(this.state.userID, this.state.accessToken)
      }
    }).catch(error => {
      console.log(error)
    });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainerRequests}>
          {renderIf(this.state.invitationStatus == true)(
            <Card containerStyle={{ flex: 1, borderRightWidth: 0, borderLeftWidth: 0, borderRightColor: 'white', borderLeftColor: 'white', borderTopWidth: 0, borderBottomWidth: 0 }}>
              {
                this.state.pendingRequests.map((u, i) => {
                  return (
                    <View key={u.id} style={styles.mainCard}>
                      <View style={styles.cardView}>
                        <TouchableOpacity>
                          <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={require('../../../../Images/Icons/Avatar.png')}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity><Text style={styles.name}>{u.sent_by_full_name}</Text></TouchableOpacity>
                        <View style={styles.inviteButton}>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.acceptDeclineUserRequest(u.sent_by_user_id, 'Accepted')}>
                              <Feather name='check' size={18} color='white' style={{
                                backgroundColor: '#FC3838',
                                borderRadius: 25,
                                padding: 5,
                              }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.acceptDeclineUserRequest(u.sent_by_user_id, 'Declined')}>
                              <Feather name='x' size={17} color='#FC3838' style={{
                                backgroundColor: 'white',
                                borderColor: '#FC3838',
                                borderWidth: 1,
                                borderRadius: 25,
                                padding: 5,
                                marginLeft: 10
                              }} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.username}>@{u.sent_by_user_name}</Text>
                    </View>
                  );
                })
              }
            </Card>
          )}
          {renderIf(this.state.invitationStatus == false)(
            <View style={{alignSelf : 'center', alignContent: 'center',marginTop: 50,}}>
              <Text style={{color : 'black', fontSize : 20, textAlign : 'center'}}>No Invitations Found</Text>
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