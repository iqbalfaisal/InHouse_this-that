import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainerDefaultInterests : {
    backgroundColor : 'white',
    alignItems : 'center'
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
    marginTop : 50,
    fontWeight : 'bold'
  },
  textStyleContinue : {
    fontSize: 12,
    color: '#A4A4A4',
    textAlign: 'center',
    paddingBottom: 10,
  },
  defaultInterestStyle : {
    backgroundColor: 'white', 
    elevation: 10, 
    marginBottom: 10, 
    alignSelf: 'flex-start', 
    marginRight: 20, 
    padding : 20,
  },
  defaultInterestStyleSelected : {
    backgroundColor: '#FC3838', 
    elevation: 10, 
    marginBottom: 10, 
    alignSelf: 'flex-start', 
    marginRight: 20, 
    padding : 20,
  },
  defaultInterestStyleText : {
    color : 'black',
    fontSize : 15
  },
  defaultInterestStyleSelectedText : {
    color : 'white',
    fontSize : 15
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  saveInterestsButton: {
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
})
