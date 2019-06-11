import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerNewPassword : {
    backgroundColor : 'white',
    paddingLeft : 20,
    paddingRight : 20,
    alignItems : 'center',
    marginTop : 20
  },
  headerLogoStyle : {
    flex : 1,
    alignSelf : 'center',
    paddingTop : 30
  },
  newPasswordForm: {
    alignSelf: 'stretch',
  },
  textStyle: {
    fontSize: 15,
    color: '#232632',
    textAlign: 'center',
    paddingBottom: 10,
    marginTop : 20,
    fontWeight : 'bold'
  },
  textInput: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 25,
    color: '#757575',
  },
  textStyleContinue : {
    fontSize: 12,
    color: '#A4A4A4',
    textAlign: 'center',
    paddingBottom: 20,
    fontWeight : 'bold'
  },
  error: {
    borderBottomColor: 'red'
  },
  resetButton: {
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
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    marginTop : 30,
    height: 300,
    width: 300,
    elevation : 10
  },
  modalText: {
    textAlign : 'center',
    fontSize: 15,
    marginTop : 20
  }
})
