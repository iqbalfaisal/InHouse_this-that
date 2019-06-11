import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerFriends : {
    backgroundColor: 'white',
  },
  displayFriends : {
    flexDirection : 'row',
    marginTop : 10
  },
  image : {
    borderRadius : 50,
    width : 35,
    height : 35,
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
  mainCard : {
    paddingBottom : 20
  },
  cardView : {
    flexDirection : "row",
  },
  cardTouchableOpacity : {
    borderWidth : 0
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
  interestsStyle : {
    marginRight : 10,
    backgroundColor : '#FC3838',
    marginBottom : 5
  },
  addFriendButton: {
    alignSelf: 'stretch',
    alignSelf : 'center',
    marginTop : 30,
    shadowColor: 'rgba(46, 229, 157, 0.2)',
    shadowOpacity: 0.5,
    elevation: 3,
    shadowRadius: 20 ,
    shadowOffset : { width: 1, height: 5},
    backgroundColor: 'rgba(46, 229, 157, 0.2)',
  },
  viewPendingRequests : {
    alignSelf: 'stretch',
    alignSelf : 'center',
    color : '#FC3838',
    fontSize : 15,
    marginBottom : 10
  }
})
