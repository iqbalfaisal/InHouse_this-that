import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerViewPoll : {
    backgroundColor : 'white',
    paddingLeft : 15,
    paddingRight : 15
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal3: {
    marginTop : 30,
    height: 300,
    width: 300,
    backgroundColor : 'rgba(255,255,255,0)'
  },
  cardView : {
    flexDirection : "row",
  },
  name : {
    padding : 8,
    fontSize : 15,
    marginTop : -8,
    fontWeight : 'bold'
  },
  username : {
    padding : 8,
    fontSize : 12,
    marginLeft : 35,
    marginTop : -25
  },
  image : {
    borderRadius : 50,
    width : 35,
    height : 35,
  },
  imageComment : {
    borderRadius : 50,
    width : 30,
    height : 30,
  },
  commentatorName : {
    padding : 5,
    fontSize : 13,
    marginTop : -5,
    fontWeight : 'bold'
  },
  comment : {
    padding : 5,
    fontSize : 11,
    marginLeft : 30,
    marginTop : -20
  },
  pollTitle : {
    fontWeight : 'bold',
    fontSize : 18,
    alignSelf : 'flex-start'
  },
  pollExpiration : {
    fontSize : 15,
    alignSelf : 'flex-start'
  },
  addExpBtn : {
    alignSelf: 'stretch',
    alignSelf : 'center',
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 1,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
    marginBottom: 10,
  },

  //Add Experience Modal
  modal4: {
    elevation : 5,
    backgroundColor : 'rgba(255, 255, 255, 0.9)'
  },
  modalText: {
    textAlign : 'center',
    fontSize: 15,
    marginTop : 20
  },
  saveButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 40,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 1,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
  },
  cancelButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 15,
    marginBottom : 20,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 1,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
  },
})
