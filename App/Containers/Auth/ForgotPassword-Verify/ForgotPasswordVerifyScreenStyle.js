import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerForgotVerify : {
    backgroundColor : 'white',
    paddingLeft : 20,
    paddingRight : 20,
    paddingTop : 30,
    alignItems : 'center'
  },
  forgotVerifyForm: {
    alignSelf: 'stretch',
  },
  headerLogoStyle : {
    flex : 1,
    alignSelf : 'center',
    paddingTop : 30
  },
  textStyle: {
    fontSize: 15,
    color: '#232632',
    textAlign: 'center',
    paddingBottom: 10,
    marginTop : 20,
    fontWeight : 'bold'
  },
  textStyleContinue : {
    fontSize: 13,
    color: '#A4A4A4',
    textAlign: 'center',
    paddingBottom: 10,
    marginTop : 20,
    fontWeight : 'bold'
  },
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#2699FB'
  },
  textStyle: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    paddingTop : 40,
    fontWeight : 'bold'
  },
  resetForm: {
    alignSelf: 'stretch',
  },
  resendButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 30,
    borderRadius: 5,
  },
  btnText: {
    color: '#2699FB',
    fontWeight: 'bold',
  },
  error: {
    borderBottomColor: 'red'
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F6CE'
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    color: 'red',
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 30
  },
  wrapper: {
    marginTop: 30
  },
  resendButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 40,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
  },
})
