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
import PasswordInputText from '../../CustomComponents/PasswordField/passwordInput'
import ImagePicker from 'react-native-image-picker'
import renderIf from '../../CustomComponents/RenderIf/renderIf'
import { BackHandler } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';

// Styles
import styles from './EditProfileScreenStyle'
const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      userID: '',
      accessToken: '',
      fullName: '',
      fullNameDisplay: '',
      userDescription: '',
      imageSource: '',
      userProfileImage: '',
      userDescription: '',
      userInterests: [],
      userInterestsDisplay: []
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
  componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    this.props.navigation.navigate('Profile')
    // this.resetNavigation('MainScreen')
    return true;
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getUserData(value2, value)
    }
    catch (error) { }
  }
  componentDidMount() {
    console.log('Edit Profile Screen')
    this.retrieveDataGlobalDetails('userTokenGlobal')
    const { navigation } = this.props;
    const userFullName = navigation.getParam('userFullName');
    const avatar = navigation.getParam('userAvatar');
    console.log(avatar)
    const description = navigation.getParam('userDescription');
    this.setState({ fullNameDisplay: userFullName })
    this.setState({ fullName: userFullName })
    this.setState({ userProfileImage: avatar })
    if (description == null) {
      this.setState({ userDescription: 'Your Description' })
    }
    else {
      this.setState({ userDescription: description })
    }
    const interests = [];
    interests.push(navigation.getParam('userInterests'))
    //console.log(interests[0].length)
    try {
      if (interests[0].length != undefined) {
        for (let i = 0; i < interests[0].length; i++) {
          this.state.userInterests.push(interests[0][i])
          //console.log(interests[i])
        }
        // Adding only two items to the display
        if (interests[0].length > 2) {
          for (let i = 0; i < 2; i++) {
            this.state.userInterestsDisplay.push(interests[0][i])
          }
        }
        else {
          for (let i = 0; i < interests[0].length; i++) {
            this.state.userInterestsDisplay.push(interests[0][i])
          }
        }
      }
    } catch (ex) {
      console.log(ex)
      const totalInterests = [];
      totalInterests.push(navigation.getParam('userTotalInterests'))
      console.log(totalInterests)
      if (totalInterests != null) {
        for (let i = 0; i < totalInterests[0].length; i++) {
          this.state.userInterests.push(totalInterests[0][i])
        }
        // Adding only two items to the display
        if (totalInterests[0].length > 2) {
          for (let i = 0; i < 2; i++) {
            this.state.userInterestsDisplay.push(totalInterests[0][i])
          }
        }
        else {
          for (let i = 0; i < totalInterests[0].length; i++) {
            this.state.userInterestsDisplay.push(totalInterests[0][i])
          }
        }
      }
    }
  }

  imagePickerDefault = () => {
    console.log('imagePickerTriggered')
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

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
          userProfileImage: source.uri,
        });
        console.log(this.state.userProfileImage)
      }
    });
  }
  editProfileSave = () => {
    let fullNameRegex = /^[a-zA-Z\s]*$/;
    console.log(this.state.fullName)
    console.log(this.state.userProfileImage)
    if (this.state.fullName != '' && this.state.userDescription != '') {
      if (fullNameRegex.test(this.state.fullName) === false) {
        ToastAndroid.show('Your name cannot contain special charaters, try again', ToastAndroid.LONG);
      }
      else {
        const api = API.create()
        const headers = {
          'access_token': this.state.accessToken,
          'user_id': this.state.userID
        }
        api.updateProfileInfo(headers, this.state.userID, this.state.fullName, this.state.userDescription, this.state.userProfileImage).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        });
      }
    }
    else {
      ToastAndroid.show('One of the fields are empty', ToastAndroid.LONG);
    }
  }
  viewAllInterests = () => {
    this.props.navigation.navigate('ViewAllInterestsScreen', {
      selectedInterests: this.state.userInterests,
      userFullName: this.state.fullNameDisplay,
      userAvatar: this.state.userProfileImage,
      userDescription: this.state.userDescription,      
    })
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerEditProfile}>
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
                <View style={{ backgroundColor: '#FC3838', padding: 5, borderRadius: 25, width: 30, height: 30, alignSelf: 'flex-end', marginTop: -30 }}>
                  {/* <Icon
                    type='evilicon'
                    size={15}
                    name='ei-camera'
                    color='white'
                    containerStyle={{
                      marginTop: 2
                    }}
                    onPress={this.imagePickerDefault}
                  /> */}
                  <Feather name='camera' size={18} color='white' containerStyle={{
                      marginTop: 2,
                      zIndex : 999
                    }}
                    onPress={this.imagePickerDefault} />
                </View>
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
                <View style={{ backgroundColor: '#FC3838', padding: 5, borderRadius: 25, width: 30, height: 30, alignSelf: 'flex-end', marginTop: -30 }}>
                  <Icon
                    type='font-awesome'
                    size={15}
                    name='camera'
                    color='white'
                    containerStyle={{
                      marginTop: 2
                    }}
                    onPress={this.imagePickerDefault}
                  />
                </View>
              </View>
            )}
          </View>
          {/* Input Fields */}
          <View style={{ marginTop: 20 }}>
            <TextInput style={[styles.textInput, !this.state.validated ? styles.error : null]} placeholder={this.state.fullNameDisplay} placeholderTextColor="black" underlineColorAndroid={'#FC3838'}
              autoCapitalize={'none'} autoCorrect={false} onChangeText={(fullName) => this.setState({ fullName: fullName })}
              value={this.state.fullName}>
            </TextInput>
            <TextInput style={[styles.textInput, !this.state.validated ? styles.error : null]} placeholder={this.state.userDescription} placeholderTextColor="black" underlineColorAndroid={'#FC3838'}
              autoCapitalize={'none'} autoCorrect={false} onChangeText={(userDescription) => this.setState({ userDescription: userDescription })}
              value={this.state.userDescription}>
            </TextInput>
          </View>
          {/* My Interests */}
          <View>
            <Text style={{ alignSelf: 'flex-start', color: 'black', marginTop: 20 }}>
              My Interests
            </Text>
            <ScrollView style={{ flexDirection: 'row',  marginTop: 10, borderBottomColor : '#FC3838', borderWidth : 2, borderTopWidth : 0, borderLeftWidth : 0, borderRightWidth : 0 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                this.state.userInterests.map((u, i) => {
                  return (
                    <View key={i}>
                      <Badge containerStyle={styles.interestsStyle}>
                        <View>
                          <Text>{u.name}</Text>
                          {/* <Icon
                            type='evilicon'
                            size={18}
                            name='close'
                            color='black'
                            containerStyle={{
                              marginTop: 3,
                              marginLeft: 5
                            }}
                          /> */}
                        </View>
                      </Badge>
                    </View>
                  );
                })
              }
            </ScrollView>
          </View>
          <View style={{ alignSelf: 'flex-end', marginTop: 5 }}>
            <Text style={{ color: '#FC3838', fontWeight: 'bold' }} onPress={this.viewAllInterests}>View all</Text>
          </View>
          {/* Save Button */}
          <TouchableOpacity style={styles.saveEditProfileButton} onPress={this.editProfileSave}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
              style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}