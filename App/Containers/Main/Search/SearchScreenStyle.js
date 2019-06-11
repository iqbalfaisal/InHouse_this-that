import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerSearch: {
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop : 5
  },
  searchIcon: {
    padding : 6,
    position : "absolute",
    borderBottomColor : '#FC3838',
    borderBottomWidth : 2,
  },
  input: {
    flex: 1,
    borderBottomColor : '#FC3838',
    borderBottomWidth : 2,
    backgroundColor: '#fff',
    color: '#424242',
    paddingLeft : 5
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
  image : {
    borderRadius : 50,
    width : 50,
    height : 50,
  },
  name : {
    padding : 8,
    fontSize : 15,
    fontWeight : 'bold'
  },
  username : {
    padding : 12,
    fontSize : 12,
    marginLeft : 46,
    marginTop : -35
  },
  inviteText : {
    paddingTop: 10,
    paddingLeft: 15,
    fontWeight : "bold"
  },
  inviteButton : {
    // paddingLeft : 120
    position: "absolute",
    right: 0
  },
  inviteButtonText : {
    borderStyle : "solid",
    borderColor : "#BCDEFC",
    borderWidth : 2,
    padding : 10,
    fontWeight : "bold"
  }
})
