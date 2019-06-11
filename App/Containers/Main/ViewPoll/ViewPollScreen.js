import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, View, TextInput, TouchableOpacity, Button, RefreshControl, BackHandler } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { ToastAndroid } from 'react-native'
import API from '../../../Services/Api'
import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modalbox'
import { Header, Icon, Card, Badge, CheckBox } from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import renderIf from '../../CustomComponents/RenderIf/renderIf'
import moment from 'moment';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './SliderEntry.style'
import SliderEntry from './SliderEntry'
import ActionSheet from 'react-native-actionsheet'
import ActionButton from 'react-native-action-button'


const options = [
  <Feather name='edit' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>EDIT COMMENT</Text></Feather>,
  <Feather name='trash' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>DELETE COMMENT</Text></Feather>,
  <Feather name='x-circle' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
const options2 = [
  <Feather name='trash' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>DELETE COMMENT</Text></Feather>,
  <Feather name='x-circle' size={20} color='#FC3838' style={{ marginLeft: 10, alignSelf: 'flex-start' }}> <Text style={{ color: 'black', fontSize: 15 }}>CANCEL</Text></Feather>,
]
// Styles
import styles from './ViewPollScreenStyle'
const SLIDER_1_FIRST_ITEM = 1;
export default class ViewPollScreen extends Component {
  // use this poll id for testing : 65
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      accessToken: '',
      pollID: '',
      pollUserName: '',
      pollCreatedDate: '',
      pollUserProfileImage: '',
      pollExpiration: '',
      pollImages: [],
      pollMembers: [],
      pollMembersDisplay: [],
      pollDescription: '',
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      userType: boolean = false,
      clickedUserID: '',
      votedSlide: 3,
      votedSlide1Boolean: boolean = false,
      votedSlide2Boolean: boolean = false,
      optionVoteID: '',
      pollComments: [],
      pollComment: '',
      pollCommentsTest: [],
      testID: '',
      commentID: '',
      commentBody: '',
      commentEdit: boolean = false,
      pollStatus: '',
      experience: '',
      pollExperience: '',
      pollExperienceCheck: boolean = false,
      option1Percentage : '',
      option2Percentage : ''
    };
    this.renderComments = this.renderComments.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  retrieveDataGlobalDetails = async (getValue) => {
    try {
      const value = await AsyncStorage.getItem('userTokenGlobal');
      const value2 = await AsyncStorage.getItem('userIDGlobal');
      this.setState({ accessToken: value })
      this.setState({ userID: value2 })
      this.getPollDetails(value2, value)
    }
    catch (error) { }
  }
  componentDidMount() {
    console.log('Poll Screen')
    this.retrieveDataGlobalDetails('userTokenGlobal')
  }
  getPollDetails = (userID, accessToken) => {
    const { navigation } = this.props;
    const viewPollID = navigation.getParam('viewPollID');
    this.setState({ pollID: viewPollID })

    //Test
    //this.setState({ pollID: '88' })
    //TestEND

    this.refs.modal3.open()
    const api = API.create();
    const headers = {
      'access_token': accessToken,
      'user_id': userID
    }
    api.viewPollDetails(headers, this.state.pollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
      .then(response => {
        console.log('view poll details here : ',response)
        if (response.status == 200) {
          this.refs.modal3.close()
          if (response.data.poll_creator == 'User') {
            this.setState({ pollUserName: 'You' })
            this.setState({ pollMembers: response.data.members })
            this.setState({ userType: true })
            console.log('poll creator is user')
          }
          else {
            console.log('poll creator is friend')
            this.setState({ pollUserName: response.data.user_full_name })
            this.setState({ clickedUserID: response.data.user_id })
          }
          this.setState({ pollStatus: response.data.status })
          this.setState({ pollExperience: response.data.experience })
          if (this.state.pollExperience == null || this.state.pollExperience == undefined) {
            this.setState({ pollExperienceCheck: true })
          }
          else {
            this.setState({ pollExperienceCheck: false })
            this.setState({ experience: this.state.pollExperience })
          }
          this.setState({ pollCreatedDate: response.data.created_on })
          this.setState({ pollUserProfileImage: response.data.profile_pic })
          this.setState({ pollExpiration: response.data.expiration })
          this.setState({ pollImages: response.data.options })
          this.setState({ pollComments: response.data.comments })
          this.setState({option1Percentage : this.state.pollImages[0].votes.percentage})
          this.setState({option2Percentage : this.state.pollImages[1].votes.percentage})
          if (this.state.pollImages[0].votes.data != null) {
            if (this.state.pollImages[0].votes.data.user_vote == 'Yes') {
              this.setState({ votedSlide1Boolean: true })
              this.setState({ optionVoteID: this.state.pollImages[0].votes.data.id })
            }
          }
          if (this.state.pollImages[1].votes.data != null) {
            if (this.state.pollImages[1].votes.data.user_vote == 'Yes') {
              this.setState({ votedSlide2Boolean: true })
              this.setState({ optionVoteID: this.state.pollImages[1].votes.data.id })
            }
          }
          this.setState({ pollDescription: response.data.description })
          console.log('check user comments : ', this.state.pollComments)
        }
        else {
          this.refs.modal3.close()
        }
      })
      .catch(error => {
        this.refs.modal3.close()
      })
  }
  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }
  tappedOption = (activeSlide) => {
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    if (activeSlide == 0) {
      if (this.state.votedSlide2Boolean == true) {
        ToastAndroid.show('You have already casted your vote, delete your previous vote first', ToastAndroid.LONG);
      }
      else {
        if (this.state.votedSlide1Boolean == true) {
          console.log('delete vote from slide 0')
          api.deleteVoteOnPoll(headers, this.state.optionVoteID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
            .then(response => {
              console.log(response)
              if (response.status == 200) {
                this.setState({ votedSlide1Boolean: false })
                this.getPollDetails(this.state.userID, this.state.accessToken)
              }
              else {
                ToastAndroid.show('Could not delete your vote, try again', ToastAndroid.LONG);
              }
            })
            .catch(error => {
              ToastAndroid.show('Could not delete your vote, try again', ToastAndroid.LONG);
            })
        }
        else {
          api.addVoteToPoll(headers, this.state.pollImages[0].option_id, this.state.pollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
            .then(response => {
              console.log(response)
              if (response.status == 200) {
                //this.setState({ votedSlide1Boolean: true })
                this.getPollDetails(this.state.userID, this.state.accessToken)
              }
              else {
                ToastAndroid.show('Could not cast your vote, try again', ToastAndroid.LONG);
              }
            })
            .catch(error => {
              ToastAndroid.show('Could not cast your vote, try again', ToastAndroid.LONG);
            })
        }
      }
    }
    else if (activeSlide == 1) {
      if (this.state.votedSlide1Boolean == true) {
        ToastAndroid.show('You have already casted your vote, delete your previous vote first', ToastAndroid.LONG);
      }
      else {
        if (this.state.votedSlide2Boolean == true) {
          console.log('delete vote from slide 1')
          api.deleteVoteOnPoll(headers, this.state.optionVoteID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
            .then(response => {
              console.log(response)
              if (response.status == 200) {
                this.setState({ votedSlide2Boolean: false })
                this.getPollDetails(this.state.userID, this.state.accessToken)
              }
              else {
                ToastAndroid.show('Could not delete your vote, try again', ToastAndroid.LONG);
              }
            })
            .catch(error => {
              ToastAndroid.show('Could not delete your vote, try again', ToastAndroid.LONG);
            })
        }
        else {
          api.addVoteToPoll(headers, this.state.pollImages[1].option_id, this.state.pollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
            .then(response => {
              console.log(response)
              if (response.status == 200) {
                //this.setState({ votedSlide2Boolean: true })
                this.getPollDetails(this.state.userID, this.state.accessToken)
              }
              else {
                ToastAndroid.show('Could not cast your vote, try again', ToastAndroid.LONG);
              }
            })
            .catch(error => {
              ToastAndroid.show('Could not cast your vote, try again', ToastAndroid.LONG);
            })
        }
      }
    }
  }
  mainExample(number, title) {
    const { slider1ActiveSlide } = this.state;
    if (this.state.pollStatus == 'Inactive') {
      return (
        <View>
          <Carousel
            ref={c => this._slider1Ref = c}
            data={this.state.pollImages}
            renderItem={this._renderItemWithParallax}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerStyle={{ alignSelf: 'center' }}
            hasParallaxImages={true}
            firstItem={SLIDER_1_FIRST_ITEM}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            // inactiveSlideShift={20}
            containerCustomStyle={{ alignSelf: 'center' }}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={false}
            loopClonesPerSide={2}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
          />
          {renderIf(this.state.slider1ActiveSlide == 0)(
            <View style={{flexDirection : 'row',alignSelf: 'flex-end', marginTop: -70, marginRight: 40,}}>
              {/* <View style={{ backgroundColor: '#FC3838', borderColor: '#FC3838', borderRadius: 25, borderWidth: 2 }}>
                <Feather name='check' size={20} color='white' style={{ padding: 4 }} />
              </View> */}
              <View style={{ backgroundColor: '#FC3838', borderColor: '#FC3838', borderRadius: 25, borderWidth: 2, marginLeft : 5, padding : 5 }}>
                <Text style={{color : 'white', fontWeight : 'bold', marginTop : -2}}>{this.state.option1Percentage}%</Text>
              </View>
            </View>
          )}
          {renderIf(this.state.slider1ActiveSlide == 1)(
            <View style={{flexDirection : 'row',alignSelf: 'flex-end', marginTop: -70, marginRight: 40, }}>
              {/* <View style={{ backgroundColor: '#FC3838', borderColor: '#FC3838', borderRadius: 25, borderWidth: 2 }}>
                <Feather name='check' size={20} color='white' style={{ padding: 4 }} />
              </View> */}
              <View style={{ backgroundColor: '#FC3838', borderColor: '#FC3838', borderRadius: 25, borderWidth: 2, marginLeft : 5, padding : 5 }}>
                <Text style={{color : 'white', fontWeight : 'bold', marginTop : -2}}>{this.state.option2Percentage}%</Text>
              </View>
            </View>
          )}
          <Pagination
            dotsLength={this.state.pollImages.length}
            activeDotIndex={slider1ActiveSlide}
            containerStyle={{ alignSelf: 'center' }}
            dotColor={'#F42846'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'#F34671'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this._slider1Ref}
            tappableDots={!!this._slider1Ref}
          />
        </View>
      );
    }
    if (this.state.userType == true) {
      return (
        <View>
          <Carousel
            ref={c => this._slider1Ref = c}
            data={this.state.pollImages}
            renderItem={this._renderItemWithParallax}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerStyle={{ alignSelf: 'center' }}
            hasParallaxImages={true}
            firstItem={SLIDER_1_FIRST_ITEM}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            // inactiveSlideShift={20}
            containerCustomStyle={{ alignSelf: 'center' }}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={false}
            loopClonesPerSide={2}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
          />
          <Pagination
            dotsLength={this.state.pollImages.length}
            activeDotIndex={slider1ActiveSlide}
            containerStyle={{ alignSelf: 'center' }}
            dotColor={'#F42846'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'#F34671'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this._slider1Ref}
            tappableDots={!!this._slider1Ref}
          />
        </View>
      );
    }
    else {
      return (
        <View>
          <Carousel
            ref={c => this._slider1Ref = c}
            data={this.state.pollImages}
            renderItem={this._renderItemWithParallax}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerStyle={{ alignSelf: 'center' }}
            hasParallaxImages={true}
            firstItem={SLIDER_1_FIRST_ITEM}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            // inactiveSlideShift={20}
            containerCustomStyle={{ alignSelf: 'center' }}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={false}
            loopClonesPerSide={2}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
          />
          {/* {renderIf(this.state.pollMembers.length >= 3)(
            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
              <View style={{
                height: 25,
                width: 25,
                marginTop: 5,
                borderRadius: 25,
                backgroundColor: '#FD3F36',
              }}>
                <Text style={{ color: 'white', marginLeft: 4, marginTop: 2, fontSize: 13, fontWeight: 'bold' }}>+{(this.state.pollMembers.length) - 2 + 1}</Text>
              </View>
            </View>
          )} */}
          {renderIf(this.state.slider1ActiveSlide == 0)(
            <View style={{alignSelf: 'flex-end', marginTop: -70, marginRight: 40, flexDirection : 'row'}}>
              <View style={[{borderRadius: 25, borderWidth: 2},this.state.votedSlide1Boolean == true ? {backgroundColor: '#FC3838', borderColor: '#FC3838'} : {backgroundColor: 'rgba(252, 56, 56, 0.4)', borderColor: 'rgba(252, 56, 56, 0.4)'}]}>
                <Feather name='check' size={20} color='white' style={{ padding: 4 }} onPress={() => this.tappedOption(this.state.slider1ActiveSlide)} />
              </View>
              {renderIf(this.state.votedSlide1Boolean == true)(
                  <Text style={{color : '#FC3838', fontWeight : 'bold'}}>Voted</Text>
              )}
            </View>
          )}
          {renderIf(this.state.slider1ActiveSlide == 1)(
            <View style={{alignSelf: 'flex-end', marginTop: -70, marginRight: 40, flexDirection : 'row'}}>
              <View style={[{borderRadius: 25, borderWidth: 2},this.state.votedSlide2Boolean == true ? {backgroundColor: '#FC3838', borderColor: '#FC3838'} : {backgroundColor: 'rgba(252, 56, 56, 0.4)', borderColor: 'rgba(252, 56, 56, 0.4)'}]}>
                <Feather name='check' size={20} color='white' style={{ padding: 4 }} onPress={() => this.tappedOption(this.state.slider1ActiveSlide)} />
              </View>
              {renderIf(this.state.votedSlide2Boolean == true)(
                  <Text style={{color : '#FC3838', fontWeight : 'bold', marginLeft : 5, marginTop : 6}}>Voted</Text>
                )}
            </View>
          )}
          <Pagination
            dotsLength={this.state.pollImages.length}
            activeDotIndex={slider1ActiveSlide}
            containerStyle={{ alignSelf: 'center' }}
            dotColor={'#F42846'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'#F34671'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this._slider1Ref}
            tappableDots={!!this._slider1Ref}
          />
        </View>
      );
    }
  }
  onPressCard = () => {
    if (this.state.userType == true) {

    }
    else {
      this.props.navigation.navigate('ViewUserProfileScreen', {
        otherUserID: this.state.clickedUserID,
        otherUserProfileName: this.state.pollUserName
      })
    }
  }
  onPressCardComment = (userfullname, userid) => {
    this.props.navigation.navigate('ViewUserProfileScreen', {
      otherUserID: userid,
      otherUserProfileName: userfullname
    })
  }
  addComment = () => {
    this.renderComments()
    // (headers,pollID,commentBody,currentDate)
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    if (this.state.commentEdit == true) {
      this.updateCommentOnPoll(this.state.commentID, this.state.pollComment)
    }
    else {
      api.addCommentOnPoll(headers, this.state.pollID, this.state.pollComment, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.setState({ pollComment: '' })
            this.state.pollComments.push(response.data.data)
            this.setState({ pollCommentsTest: this.state.pollComments })
            //this.componentDidMount(this)
            this.renderComments()
          }
          else {
            console.log(response)
            ToastAndroid.show('Could not add your comment, try again', ToastAndroid.LONG);
          }
        })
        .catch(error => {
          console.log('error : ', error)
          ToastAndroid.show('Could not add your comment, try again', ToastAndroid.LONG);
        })
    }
  }
  renderComments() {
    if (this.state.pollCommentsTest.length > 0) {
      return this.state.pollCommentsTest && this.state.pollCommentsTest.map((u, i) => {
        return (
          <View key={i} style={{ marginTop: 5, marginBottom: 5 }}>
            {renderIf(this.state.userType == true || u.user_comment == 'True')(
              <TouchableOpacity onPress={() => this.onPressCardComment(u.user_full_name, u.user_id)} onLongPress={() => {
                this.setState({ commentBody: u.body })
                this.setState({ testID: u.user_id })
                this.setState({ commentID: u.id })
                this.ActionSheet.show()
              }}>
                <View style={styles.cardView}>
                  <Image
                    style={styles.imageComment}
                    resizeMode="cover"
                    source={require('../../../Images/Icons/Avatar.png')}
                  />
                  <Text style={styles.commentatorName}>{u.user_full_name}</Text>
                </View>
              </TouchableOpacity>
            )}
            {renderIf(this.state.userType == false && u.user_comment == 'False')(
              <TouchableOpacity onPress={() => this.onPressCardComment(u.user_full_name, u.user_id)}>
                <View style={styles.cardView}>
                  <Image
                    style={styles.imageComment}
                    resizeMode="cover"
                    source={require('../../../Images/Icons/Avatar.png')}
                  />
                  <Text style={styles.commentatorName}>{u.user_full_name}</Text>
                </View>
              </TouchableOpacity>
            )}
            <Text style={styles.comment}>{u.body}</Text>
            {renderIf(this.state.testID != this.state.userID)(
              <View>
                <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>COMMENT</Text>}
                  options={options2}
                  cancelButtonIndex={1}
                  destructiveButtonIndex={1}
                  onPress={(index) => {
                    if (index == 0) {
                      this.deleteCommentOnPoll(this.state.commentID)
                    }
                  }}
                />
              </View>
            )}
            {renderIf(this.state.testID == this.state.userID)(
              <View>
                <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>COMMENT</Text>}
                  options={options}
                  cancelButtonIndex={2}
                  destructiveButtonIndex={2}
                  onPress={(index) => {
                    if (index == 0) {
                      this.setState({ commentEdit: true })
                      this.setState({ pollComment: this.state.commentBody })
                    }
                    else if (index == 1) {
                      this.deleteCommentOnPoll(this.state.commentID)
                    }
                  }}
                />
              </View>
            )}
          </View>
        );
      })
    }
    else {
      return this.state.pollComments && this.state.pollComments.map((u, i) => {
        return (
          <View key={i} style={{ marginTop: 5, marginBottom: 5 }}>
            {renderIf(this.state.userType == true || u.user_comment == 'True')(
              // <View style={{ flexDirection: 'row', position: 'absolute', right: 0, zIndex: 9999 }}>
              //   <Icon
              //     type='ionicon'
              //     size={20}
              //     name='md-more'
              //     color='#FC3838'
              //     containerStyle={{
              //       marginTop: 5
              //     }}
              //     onPress={() => {
              //       //this.showActions(u.user_id)
              //       this.setState({ testID: u.user_id })
              //       this.setState({ commentID: u.id })
              //       this.ActionSheet.show()
              //     }}
              //   />
              // </View>
              <TouchableOpacity onPress={() => this.onPressCardComment(u.user_full_name, u.user_id)} onLongPress={() => {
                this.setState({ commentBody: u.body })
                this.setState({ testID: u.user_id })
                this.setState({ commentID: u.id })
                this.ActionSheet.show()
              }}>
                <View style={styles.cardView}>
                  <Image
                    style={styles.imageComment}
                    resizeMode="cover"
                    source={require('../../../Images/Icons/Avatar.png')}
                  />
                  <Text style={styles.commentatorName}>{u.user_full_name}</Text>
                </View>
              </TouchableOpacity>
            )}
            {renderIf(this.state.userType == false && u.user_comment == 'False')(
              // <View style={{ flexDirection: 'row', position: 'absolute', right: 0, zIndex: 9999 }}>
              //   <Icon
              //     type='ionicon'
              //     size={20}
              //     name='md-more'
              //     color='#FC3838'
              //     containerStyle={{
              //       marginTop: 5
              //     }}
              //     onPress={() => {
              //       //this.showActions(u.user_id)
              //       this.setState({ testID: u.user_id })
              //       this.setState({ commentID: u.id })
              //       this.ActionSheet.show()
              //     }}
              //   />
              // </View>
              <TouchableOpacity onPress={() => this.onPressCardComment(u.user_full_name, u.user_id)}>
                <View style={styles.cardView}>
                  <Image
                    style={styles.imageComment}
                    resizeMode="cover"
                    source={require('../../../Images/Icons/Avatar.png')}
                  />
                  <Text style={styles.commentatorName}>{u.user_full_name}</Text>
                </View>
              </TouchableOpacity>
            )}
            <Text style={styles.comment}>{u.body}</Text>
            {renderIf(this.state.testID != this.state.userID)(
              <View>
                <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>COMMENT</Text>}
                  options={options2}
                  cancelButtonIndex={1}
                  destructiveButtonIndex={1}
                  onPress={(index) => {
                    if (index == 0) {
                      this.deleteCommentOnPoll(this.state.commentID)
                    }
                  }}
                />
              </View>
            )}
            {renderIf(this.state.testID == this.state.userID)(
              <View>
                <ActionSheet
                  ref={o => this.ActionSheet = o}
                  title={<Text style={{ color: '#000', fontSize: 15, alignSelf: 'flex-start', marginLeft: 10 }}>COMMENT</Text>}
                  options={options}
                  cancelButtonIndex={2}
                  destructiveButtonIndex={2}
                  onPress={(index) => {
                    if (index == 0) {
                      this.setState({ pollComment: this.state.commentBody })
                      this.setState({ commentEdit: true })
                    }
                    else if (index == 1) {
                      this.deleteCommentOnPoll(this.state.commentID)
                    }
                  }}
                />
              </View>
            )}
          </View>
        );
      })
    }
  }
  deleteCommentOnPoll = (pollCommentID) => {
    // (headers,pollCommentID,currentDate)
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    api.deleteCommentOnPoll(headers, pollCommentID, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.componentDidMount(this)
          this.setState({ pollCommentsTest: [] })
        }
        else {
          ToastAndroid.show('Could not delete comment, try again', ToastAndroid.LONG);
        }
      })
      .catch(error => {
        ToastAndroid.show('Could not delete comment, try again', ToastAndroid.LONG);
      })
  }
  updateCommentOnPoll = (pollCommentID, commentBody) => {
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    api.updateCommentOnPoll(headers, pollCommentID, commentBody, moment().utc().format('YYYY-MM-DD HH:mm:ss'))
      .then(response => {
        console.log(response)
        if (response.status == 200) {
          this.componentDidMount(this)
          this.setState({ pollCommentsTest: [] })
          this.setState({ pollComment: '' })
          this.setState({ commentEdit: false })
        }
        else {
          ToastAndroid.show('Could not update comment, try again', ToastAndroid.LONG);
          this.setState({ pollComment: '' })
          this.setState({ commentEdit: true })
        }
      })
      .catch(error => {
        this.setState({ pollComment: '' })
        this.setState({ commentEdit: true })
        ToastAndroid.show('Could not update comment, try again', ToastAndroid.LONG);
      })
  }
  addExpOnPoll = () => {
    // (headers,pollID,currentDate,experience)
    const api = API.create();
    const headers = {
      'access_token': this.state.accessToken,
      'user_id': this.state.userID,
      'Content-Type': 'application/json'
    }
    if (this.state.experience != '') {
      if(this.state.pollExperience != null){
        api.addExperienceOnPoll(headers, this.state.pollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'), this.state.experience, 'edit')
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.componentDidMount(this)
            this.setState({ experience: '' })
            ToastAndroid.show('Your experience was edited successfully', ToastAndroid.LONG);
            this.refs.modal4.close()
          }
          else {
            ToastAndroid.show('Could not edit experience, try again', ToastAndroid.LONG);
            this.setState({ experience: '' })
            this.refs.modal4.close()
          }
        })
        .catch(error => {
          this.setState({ experience: '' })
          this.refs.modal4.close()
          ToastAndroid.show('Could not edit experience, try again', ToastAndroid.LONG);
        })
      }
      else{
        api.addExperienceOnPoll(headers, this.state.pollID, moment().utc().format('YYYY-MM-DD HH:mm:ss'), this.state.experience, 'add')
        .then(response => {
          console.log(response)
          if (response.status == 200) {
            this.componentDidMount(this)
            this.setState({ experience: '' })
            ToastAndroid.show('Experience was added to your poll, invited members can now see what you have to say', ToastAndroid.LONG);
            this.refs.modal4.close()
          }
          else {
            ToastAndroid.show('Could not add experience, try again', ToastAndroid.LONG);
            this.setState({ experience: '' })
            this.refs.modal4.close()
          }
        })
        .catch(error => {
          this.setState({ experience: '' })
          this.refs.modal4.close()
          ToastAndroid.show('Could not add experience, try again', ToastAndroid.LONG);
        })
      }
    }
    else {
      ToastAndroid.show('Experience cannot be empty', ToastAndroid.LONG);
    }
  }
  render() {
    const mainSliderGetStarted = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
        <ScrollView style={styles.mainContainerViewPoll} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={this.onPressCard}>
              <View style={styles.cardView}>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={require('../../../Images/Icons/Avatar.png')}
                />
                <Text style={styles.name}>{this.state.pollUserName} created a poll</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.username}>{this.state.pollCreatedDate}</Text>
            <View style={{ marginTop: 20 }}>
              {mainSliderGetStarted}
            </View>
            <View style={{ flexWrap: 'wrap' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.pollTitle}>{this.state.pollDescription}</Text>
                {renderIf(this.state.userType == true)(
                  <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                    {
                      this.state.pollMembers && this.state.pollMembers.map((u, i) => {
                        if (this.state.pollMembers.length > 3) {
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
                                  source={require('../../../Images/SampleStockPhotos/stock1.jpg')}
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
                                source={require('../../../Images/SampleStockPhotos/stock1.jpg')}
                              />
                            </View>
                          );
                        }
                      })

                    }
                    {renderIf(this.state.pollMembers.length >= 3)(
                      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', position: 'absolute', right: 0 }}>
                        <View style={{
                          height: 25,
                          width: 25,
                          marginTop: 5,
                          borderRadius: 25,
                          backgroundColor: '#FD3F36',
                        }}>
                          <Text style={{ color: 'white', marginLeft: 4, marginTop: 2, fontSize: 13, fontWeight: 'bold' }}>+{(this.state.pollMembers.length) - 2 + 1}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
              {renderIf(this.state.pollExpiration.days > 0)(
                <Text style={styles.pollExpiration}>This poll will end in {this.state.pollExpiration.days} days</Text>
              )}
              {renderIf(this.state.pollExpiration.days <= 0 && this.state.pollExpiration.hours > 0)(
                <Text style={styles.pollExpiration}>This poll will end in {this.state.pollExpiration.hours} hours</Text>
              )}
              {renderIf(this.state.pollExpiration.days <= 0 && this.state.pollExpiration.hours <= 0 && this.state.pollExpiration.minutes > 0)(
                <Text style={styles.pollExpiration}>This poll will end in {this.state.pollExpiration.minutes} minutes</Text>
              )}
              {/* <Text style={styles.pollExpiration}>This poll will end in {this.state.pollExpiration.days} days, {this.state.pollExpiration.hours} hours, {this.state.pollExpiration.minutes} minutes</Text> */}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Feather name='message-square' size={20} color='#FC3838' style={{
                marginTop: 10,
                alignSelf: 'flex-start'
              }} />
              <Text style={{ marginLeft: 10, marginTop: 9, fontWeight: 'bold', marginRight: 180 }}>{this.state.pollComments.length}</Text>
            </View>
            {/* <View style={{ marginTop: 20, flexWrap: 'wrap' }}>
              {
                this.state.pollComments && this.state.pollComments.map((u, i) => {
                  return (
                    <View key={i} style={{ marginTop: 5, marginBottom: 5 }}>
                      <TouchableOpacity onPress={this.onPressCard}>
                        <View style={styles.cardView}>
                          <Image
                            style={styles.imageComment}
                            resizeMode="cover"
                            source={require('../../../Images/Icons/Avatar.png')}
                          />
                          <Text style={styles.commentatorName}>{u.user_full_name}</Text>
                        </View>
                      </TouchableOpacity>
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
                      <Text style={styles.comment}>{u.body}</Text>
                    </View>
                  );
                })
              }
            </View> */}
            {this.renderComments()}
          </View>
          {/* Loading Modal */}
          <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} backdrop={true} coverScreen={true} backdropPressToClose={false}>
            <View>
              <Bars size={20} color="#FC3838" />
            </View>
          </Modal>
          {/* Add Experience Modal */}
          <Modal style={[styles.modal, styles.modal4]} position={"center"} ref={"modal4"} backdrop={false}>
            <Text style={styles.modalText}>Describe your exerience about the poll</Text>
            <View style={{ borderColor: '#FC3838', borderWidth: 2, padding: 5, alignSelf: 'stretch', marginTop: 8, borderRadius: 8, paddingLeft: 10, paddingRight: 10, }}>
              <TextInput
                style={{ textAlign: 'left' }}
                textAlignVertical={'top'}
                multiline={true}
                numberOfLines={6}
                underlineColorAndroid='transparent'
                placeholder='Write something...'
                placeholderTextColor='#757575'
                value={this.state.experience}
                onChangeText={(text) => this.setState({ experience: text })}
                minLength={10}
                maxLength={250}
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={this.addExpOnPoll}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{ x: 0.7, y: 1.2 }} end={{ x: 0.0, y: 0.7 }}
                style={{ height: 48, width: 270, alignItems: 'center', justifyContent: 'center', width: 270, borderRadius: 3 }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => this.refs.modal4.close()}>
              <Text style={{ color: '#FC3838', fontWeight: 'bold' }}>CANCEL</Text>
            </TouchableOpacity>
          </Modal>
        </ScrollView>

        {renderIf(this.state.userType == true && this.state.pollStatus == 'Inactive' && this.state.pollExperienceCheck == true)(
          <ActionButton
            size={100}
            title='Add Experience'
            onPress={() => this.refs.modal4.open()}
            buttonColor="#FC3838"
            icon={
              <View style={{ flexDirection: 'row' }}>
                <Feather name='plus' size={18} color='white' style={{ marginRight: 10 }} />
                <Text style={{ color: 'white', alignSelf: 'stretch' }}>Add Experience</Text>
              </View>
            }
          />
        )}
        {renderIf(this.state.pollExperienceCheck == false)(
          <View style={{ marginTop: 10 }}>
            {renderIf(this.state.userType == true)(
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 17, color: '#FC3838', marginLeft: 10 }}>Your Experience</Text>
                <Feather name='edit' size={18} color='#FC3838' style={{ position: 'absolute', right: 0, marginRight: 10 }} onPress={() => this.refs.modal4.open()} />
              </View>
            )}
            {renderIf(this.state.userType == false)(
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 17, color: '#FC3838', marginLeft: 10 }}>Poll Experience</Text>
              </View>
            )}
            <View style={{ marginTop: 2 }}>
              <Text style={{ fontSize: 15, color: 'black', marginLeft: 10 }}>{this.state.pollExperience}</Text>
            </View>
          </View>
        )}
        {renderIf(this.state.pollStatus == 'Active')(
          <Header
            leftComponent={
              <Image
                style={styles.imageComment}
                resizeMode="cover"
                source={require('../../../Images/Icons/Avatar.png')}
              />
            }
            centerComponent={
              <TextInput style={{ width: 250 }} placeholder="Add a comment" placeholderTextColor="#757575" underlineColorAndroid={'#FC3838'}
                autoCapitalize={'none'} maxLength={140} autoCorrect={false} onChangeText={(text) => this.setState({ pollComment: text })}
                value={this.state.pollComment}>
              </TextInput>
            }
            rightComponent={
              <Feather name='send' size={20} color='#FC3838' onPress={this.addComment} />
            }
            containerStyle={{
              backgroundColor: 'white',
              borderBottomWidth: 0,
            }}
          />
        )}
      </View>
    )
  }
}