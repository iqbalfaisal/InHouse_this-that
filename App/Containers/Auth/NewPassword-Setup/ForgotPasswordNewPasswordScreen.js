import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { TextField } from 'react-native-material-textfield'
import PasswordInputText from '../../CustomComponents/PasswordField/passwordInput'
import ConfirmPasswordField from '../../CustomComponents/ConfirmPasswordField/confirmpasswordfield'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Modal from 'react-native-modalbox'
import { Icon } from 'react-native-elements'



// Styles
import styles from './ForgotPasswordNewPasswordScreenStyle'

export default class ForgotPasswordNewPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmpassword: '',
      passwordvalidation: true,
      confirmpasswordvalidation: true,
      isDisabled: false,
      resetDisabled : false
    };
  }
  modalContinue = () =>{
    this.resetNavigation('LoginScreen')
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
  resetPasswordPressed = () => {
    const { navigation } = this.props;
    const userEmail = navigation.getParam('userEmail');
    const api = API.create();
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (this.state.password != '' && this.state.confirmpassword != '') {
      this.setState({ passwordvalidation: true });
      this.setState({ confirmpasswordvalidation: true });
      if (this.state.password === this.state.confirmpassword) {
        const testPass = passwordRegex.test(this.state.password);
        if (testPass === false) {
          ToastAndroid.show('Password must contain: One uppercase and lowercase character followed by atleast 1 number and special character with minimum of 8 characters in total', ToastAndroid.LONG);
          this.setState({ passwordvalidation: false });
          this.setState({ confirmpasswordvalidation: false });
          return false;
        }
        else {
          api.newPasswordSetup(userEmail, this.state.password)
            .then(response => {
              if (response.status == 200) {
                this.refs.modal3.open()
              }
              else {
                ToastAndroid.show('There was an error, please check your input and try again', ToastAndroid.LONG);
              }
            })
            .catch(error => {
              ToastAndroid.show('There was an error, please check your input and try again', ToastAndroid.LONG);
            })
        }
      }
      else {
        ToastAndroid.show('Password does not match', ToastAndroid.LONG);
      }
    }
    else {
      ToastAndroid.show('Password cannot be empty', ToastAndroid.LONG);
      this.setState({ passwordvalidation: false });
      this.setState({ confirmpasswordvalidation: false });
    }
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.mainContainerNewPassword}>
          <KeyboardAwareScrollView style={styles.newPasswordForm} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} automaticallyAdjustContentInsets={false} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
            <View style={styles.headerLogoStyle}>
              <Image
                style={styles.mainLogoHeader}
                resizeMode="cover"
                source={require('../../../Images/Icons/main-app-logo.png')}
              />
            </View>
            <Text style={styles.textStyle}> Choose a new password
            </Text>
            <Text style={styles.textStyleContinue}> Choose your new password to continue
            </Text>
            <View style={{ marginTop: 10 }}>
              <PasswordInputText
                style={[styles.textInput, !this.state.passwordvalidation ? styles.error : null]}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password: password })}
              />
              <ConfirmPasswordField
                style={[styles.textInput, !this.state.confirmpasswordvalidation ? styles.error : null]}
                value={this.state.confirmpassword}
                label="Confirm Password"
                onChangeText={(confirmpassword) => this.setState({ confirmpassword: confirmpassword })}
              />
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={this.resetPasswordPressed}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={false} isDisabled={this.state.isDisabled}>
          <Icon
            type='material-community'
            size={60}
            name='check-circle'
            color='#FC3838'
            containerStyle={{
              alignSelf: 'center'
            }}
          />
          <Text style={styles.modalText}>Your password was reset successfully, you can now use it to login</Text>
          <TouchableOpacity style={styles.resetButton} onPress={this.modalContinue}>
            <LinearGradient
              colors={['#FC3838', '#F52B43', '#ED0D51']}
              start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
              style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    )
  }
}