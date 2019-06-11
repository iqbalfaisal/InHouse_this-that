import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerEditProfile : {
    backgroundColor : 'white',
    paddingRight : 40,
    paddingLeft : 40
  },
  mainProfileHeader : {
    alignSelf : 'center'
  },
  userFullName : {
    marginTop : 20,
    fontWeight : '400',
    color : '#FC3838',
    fontSize : 20
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
    marginBottom: 10,
    color: '#757575',
  },
  saveEditProfileButton : {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 30,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
  },
  interestsStyle : {
    marginRight : 10,
    backgroundColor : 'white',
    borderColor : '#FC3838',
    borderWidth : 2,
    marginBottom : 5
  }
})
