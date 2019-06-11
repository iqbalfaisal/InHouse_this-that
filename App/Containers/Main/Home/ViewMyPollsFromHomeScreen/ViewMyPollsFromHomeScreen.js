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
import { Header, Icon, Card, Badge, Avatar } from 'react-native-elements'
import renderIf from '../../../CustomComponents/RenderIf/renderIf'
import { BackHandler } from 'react-native'
import { TabNavigator, TabBarBottom, TabBarTop } from "react-navigation"
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import ActionSheet from 'react-native-actionsheet'

// Styles
import styles from './ViewMyPollsFromHomeScreenStyle'

export default class ViewMyPollsFromHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      myPolls: [],
      pollComments : [],
      pollCommentsNumber : ''
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
    console.log('View My All Polls Screen')
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      const { navigation } = this.props;
      const actionValue = navigation.getParam('actionValue');
      if(actionValue !=null || actionValue !=undefined || actionValue != ''){
        this.getDetails(value2, value, actionValue)
      }
      else{
        this.getDetails(value2, value, 0)
      }
      this.refs.modal3.open()
    }
    catch (error) { }
  }
  getDetails = (userID, accessToken, filterValue) => {
    const api = API.create();
    const headers = {
      'access_token': accessToken,
      'user_id': userID
    }
    api.getAllPollsOfUser(headers, userID, moment().utc().format('YYYY-MM-DD HH:mm:ss'), filterValue)
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.refs.modal3.close()
          this.setState({ myPolls: response.data.data })
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerViewMyAllPolls} showsVerticalScrollIndicator={false}>
          <View>
            {
              this.state.myPolls && this.state.myPolls.map((j, k) => {
                if (this.state.myPolls.length) {
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
                            />
                          </View>
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
                          <Text style={{ marginLeft: 10, marginTop: 9, fontWeight: 'bold', marginRight: 180 }}>{j.comments == false ? '0' : j.comments.length}</Text>
                          <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
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
                                          source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
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
                                        source={require('../../../../Images/SampleStockPhotos/stock1.jpg')}
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
                          <Text>ASDSDSD</Text>
                        </View>
                      </Card>
                    </View>
                  )
                }
              })
            }
            {/* <View>
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
            </View> */}
          </View>
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