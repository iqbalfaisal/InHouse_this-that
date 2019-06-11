import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button } from 'react-native'
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
import styles from './NotificationsScreenStyle'

export default class NotificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      notifications: [],
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
    api.getNotifications(headers, this.state.userID).then(response => {
      console.log(response)
      if (response.status == 200) {
        this.setState({ notifications: response.data.data.notifications })
        this.refs.modal3.close()
      }
      else if (response.status == 400) {
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
  onPressNotification = (notificationID,typeID,notificationType,bodyName) => {
    const api = API.create()
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID
    }
    console.log('type id : ',typeID)
    console.log('notification type : ',notificationType)
    if(notificationType == 'Poll Comment Type' || notificationType == 'Poll Vote Type' || notificationType == 'Add to Poll Type' || notificationType == 'End Poll Type' || notificationType == 'Poll Experience Type'){
      api.viewNotification(headers, notificationID).then(response => {
        console.log(response)
        if (response.status == 200) {
          this.props.navigation.navigate('ViewPollScreen', {
            viewPollID: typeID,
          })
        }
      }).catch(error => {
        console.log(error)
      });
    }
    else if(notificationType == 'Request Accepted Type' || notificationType == 'Add to Friends Type'){
      api.viewNotification(headers, notificationID).then(response => {
        console.log(response)
        if (response.status == 200) {
          this.props.navigation.navigate('ViewUserProfileScreen', {
            otherUserID: typeID,
            otherUserProfileName: bodyName
          })
        }
      }).catch(error => {
        console.log(error)
      });
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={styles.mainContainerNotifications}>
          <Text style={{ marginTop: 30, fontWeight: 'bold', paddingLeft: 20, }}>Today</Text>
          <View>
            {
              this.state.notifications.map((u, i) => {
                return (
                  <Card containerStyle={[{ flexWrap: 'wrap', height : 80 }, u.is_read == 'No' ? { borderLeftColor: '#FC3838',borderLeftWidth : 5,borderRightColor: '#FC3838', borderRightWidth : 5, borderStyle : 'solid', } : { borderRightColor: 'transparent' }]}>
                    <TouchableOpacity onPress={() => this.onPressNotification(u.id,u.type_id,u.notification_type,u.body.name)}>
                      <View key={u.id} style={styles.mainCard}>
                        <TouchableOpacity onPress={() => this.onPressNotification(u.id,u.type_id,u.notification_type,u.body.name)} style={styles.cardTouchableOpacity}>
                          <View style={styles.displayNotifications}>
                            <Image
                              style={styles.image}
                              resizeMode="cover"
                              source={require('../../../Images/Icons/Avatar.png')}
                            />
                            {renderIf(u.notification_type == 'Add to Friends Type')(
                              <View style={{flexWrap: 'wrap' }}>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                  <Text style={styles.startText}>{u.body.name} <Text style={styles.notificationText}> {u.body.content} </Text></Text>
                                  <View style={{
                                    flexDirection: 'row',
                                    alignSelf: 'flex-end'
                                  }}>
                                    <TouchableOpacity onPress={() => this.acceptDeclineUserRequest(u.type_id, 'Accepted')}>
                                      <Feather name='check' size={18} color='white' style={{
                                        marginTop: 0,
                                        backgroundColor: '#FC3838',
                                        borderRadius: 25,
                                        padding: 5,
                                      }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.acceptDeclineUserRequest(u.type_id, 'Declined')}>
                                      <Feather name='x' size={18} color='white' style={{
                                        marginTop: 0,
                                        backgroundColor: '#FC3838',
                                        borderRadius: 25,
                                        padding: 5,
                                        marginLeft: 5
                                      }} />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            )}
                            {renderIf(u.notification_type == 'Request Accepted Type')(
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content} </Text></Text>
                              </View>
                            )}
                            {renderIf(u.notification_type == 'Add to Poll Type')(
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content} <Text style={styles.notificationAbout}>{u.body.poll}</Text></Text></Text>
                                <View style={{
                                  flexDirection: 'row',
                                  alignSelf: "flex-end",
                                }}>
                                </View>
                              </View>
                            )}
                            {renderIf(u.notification_type == 'Poll Vote Type')(
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content}<Text style={styles.notificationAbout}>{u.body.poll}</Text></Text></Text>
                                <View style={{
                                  flexDirection: 'row',
                                  alignSelf: "flex-end",
                                }}>
                                </View>
                              </View>
                            )}
                            {renderIf(u.notification_type == 'Poll Comment Type')(
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content}<Text style={styles.notificationAbout}>{u.body.poll}</Text></Text></Text>
                                <View style={{
                                  flexDirection: 'row',
                                  alignSelf: "flex-end",
                                }}>
                                </View>
                              </View>
                            )}
                            {renderIf(u.notification_type == 'End Poll Type')(
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.startText}>{u.body.poll}<Text style={styles.notificationText}> {u.body.content}</Text></Text>
                                <View style={{
                                  flexDirection: 'row',
                                  alignSelf: "flex-end",
                                }}>
                                </View>
                              </View>
                            )}
                            {renderIf(u.notification_type == 'Poll Experience Type')(
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content}<Text style={styles.notificationAbout}>{u.body.poll}</Text></Text></Text>
                                <View style={{
                                  flexDirection: 'row',
                                  alignSelf: "flex-end",
                                }}>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Card>
                );
              })
            }
          </View>
          {/* <Card containerStyle={{ flex: 1, borderRightWidth: 0, borderLeftWidth: 0, borderRightColor: 'white', borderLeftColor: 'white', borderTopWidth: 0, borderBottomWidth: 0 }}>
            {
              this.state.notifications.map((u, i) => {
                return (
                  <View key={u.id} style={styles.mainCard}>
                    <TouchableOpacity style={styles.cardTouchableOpacity}>
                      <View style={styles.displayNotifications}>
                        <Image
                          style={styles.image}
                          resizeMode="cover"
                          source={require('../../../Images/Icons/Avatar.png')}
                        />
                        {renderIf(u.notification_type == 'Add to Friends Type')(
                          <View style={[{flexWrap : 'wrap'}, u.is_read == 'No' ? {borderBottomColor : '#FC3838', borderBottomWidth : 2} : {backgroundColor : 'transparent'}]}>
                            <View style={{ flexWrap: 'wrap', flexDirection : 'row' }}>
                              <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content} </Text></Text>
                              <View style={{
                              flexDirection: 'row',
                              alignSelf : 'flex-end'
                            }}>
                              <TouchableOpacity onPress={() => this.acceptDeclineUserRequest(u.type_id, 'Accepted')}>
                                <Feather name='check' size={18} color='white' style={{
                                  marginTop: 0,
                                  backgroundColor: '#FC3838',
                                  borderRadius: 25,
                                  padding: 5,
                                }} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => this.acceptDeclineUserRequest(u.type_id, 'Declined')}>
                                <Feather name='x' size={18} color='white' style={{
                                  marginTop: 0,
                                  backgroundColor: '#FC3838',
                                  borderRadius: 25,
                                  padding: 5,
                                  marginLeft : 5
                                }} />
                              </TouchableOpacity>
                            </View>
                            </View>
                          </View>
                        )}
                        {renderIf(u.notification_type == 'Request Accepted Type')(
                          <View style={{ flexWrap: 'wrap' }}>
                            <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content} </Text></Text>
                          </View>
                        )}
                        {renderIf(u.notification_type == 'Add to Poll Type')(
                          <View style={{ flexWrap: 'wrap' }}>
                            <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content} <Text style={styles.notificationAbout}>{u.body.poll} </Text></Text></Text>
                            <View style={{
                              flexDirection: 'row',
                              alignSelf: "flex-end",
                            }}>
                            </View>
                          </View>
                        )}
                        {renderIf(u.notification_type == 'Poll Vote Type')(
                          <View style={{ flexWrap: 'wrap' }}>
                            <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content} <Text style={styles.notificationAbout}>{u.body.poll} </Text></Text></Text>
                            <View style={{
                              flexDirection: 'row',
                              alignSelf: "flex-end",
                            }}>
                            </View>
                          </View>
                        )}
                        {renderIf(u.notification_type == 'Poll Comment Type')(
                          <View style={{ flexWrap: 'wrap' }}>
                            <Text style={styles.startText}>{u.body.name}<Text style={styles.notificationText}> {u.body.content}<Text style={styles.notificationAbout}>{u.body.poll} </Text></Text></Text>
                            <View style={{
                              flexDirection: 'row',
                              alignSelf: "flex-end",
                            }}>
                            </View>
                          </View>
                        )}
                        {renderIf(u.notification_type == 'End Poll Type')(
                          <View style={{ flexWrap: 'wrap' }}>
                            <Text style={styles.startText}>{u.body.poll}<Text style={styles.notificationText}> {u.body.content}</Text></Text>
                            <View style={{
                              flexDirection: 'row',
                              alignSelf: "flex-end",
                            }}>
                            </View>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            }
          </Card> */}
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