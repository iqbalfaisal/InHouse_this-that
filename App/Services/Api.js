// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
const create = (baseURL = 'http://clients2.5stardesigners.net/thisorthat/backend/web/v1/') => {

  const api = (headers)=> apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    headers ,
    // 10 second timeout...
    timeout: 10000
  })

  const baseapi = apisauce.create({
    baseURL,
    timeout: 10000
  })
  const baseapiwithheaders = (headers) => apisauce.create({
    baseURL,
    headers,
    timeout : 10000
  })

  //list of apis
  const registration = (userName,userEmail,userPass,userFullName,deviceToken) => baseapi.post('users', {user_name:userName,user_email:userEmail,user_password:userPass,full_name:userFullName, device_token : deviceToken})
  const registrationtoken = (userEmail) => baseapi.post('users/registration-token',{user_email : userEmail})
  const postLogin = (userEmail,userPass) => baseapi.post('users/login', { user_email: userEmail , user_password:userPass })
  const resetPassword = (userEmail) => baseapi.post('users/reset-password-request',{user_email:userEmail})
  const verifyResetPasswordCode = (userEmail,Code) => baseapi.post('users/verify-token',{user_email:userEmail,code:Code})
  const newPasswordSetup = (userEmail,userPass) => baseapi.post('users/reset-password',{user_email:userEmail,new_password:userPass})
  const getDefaultInterests = () => baseapi.get('default-interests')
  const saveUserInterests = (selected_interests,userID) => baseapi.post(`user-interests/${userID}`,{interests : selected_interests}) 
  const getUserData = (headers,userID) => baseapiwithheaders(headers).get(`users/${userID}`)
  const updateProfileInfo = (headers,userID,fullName,description,profilePic) => baseapiwithheaders(headers).post(`users/${userID}/profile`,{full_name : fullName, description : description, profile_pic : profilePic})
  const updateUserInterestsEditProfile = (headers,totalInterests,userID) => baseapiwithheaders(headers).post(`user-interests/${userID}/interest`,{interests : totalInterests})
  const searchUser = (headers,userID,searchKey) => baseapiwithheaders(headers).get(`users/${userID}/search?key=${searchKey}`)
  const addFriend = (headers,userID,friendID) => baseapiwithheaders(headers).post(`user-requests/${userID}/request`,{requested_user_id : friendID})
  const viewProfileOtherUser = (headers,userID,otherUserID) => baseapiwithheaders(headers).get(`users/${userID}/profile/${otherUserID}`)
  const deleteFriendRequest = (headers,userID) => baseapiwithheaders(headers).delete(`user-requests/${userID}`)
  const getNotifications = (headers, userID) => baseapiwithheaders(headers).get(`user-notifications/${userID}/notification`)
  const viewNotification = (headers,notificationID) => baseapiwithheaders(headers).get(`user-notifications/${notificationID}`)
  const userAcceptOrDeclineRequest = (headers,userID, status) => baseapiwithheaders(headers).post(`user-requests/${userID}`,{status : status})
  const getAllUserInformation = (headers,userID,currentDate,filterValue) => baseapiwithheaders(headers).get(`users/${userID}?${currentDate}&filter=${filterValue}`)
  const getAllRequestsOfUser = (headers,userID) => baseapiwithheaders(headers).get(`user-requests/${userID}/requests`)
  const createPoll = (headers,userID, pollDescription, expirationDays,createdDate, privacyType, imagesArray,friendsArray) => baseapiwithheaders(headers).post(`user-polls/${userID}`,{description : pollDescription,expiration_days : expirationDays,created_on : createdDate,privacy_type : privacyType,options : imagesArray, members : friendsArray})
  const viewPollDetails = (headers,pollID,currentDate) => baseapiwithheaders(headers).get(`user-polls/${pollID}?current_date=${currentDate}`)
  const updatePoll = (headers,pollID,pollDescription, expirationDays,currentDate, privacyType, imagesArray,friendsArray) => baseapiwithheaders(headers).put(`user-polls/${pollID}`,{id : pollID, description : pollDescription,expiration_date : expirationDays, current_date : currentDate,privacy_type : privacyType,options : imagesArray,members : friendsArray, poll_creator : 'User'})
  const addVoteToPoll = (headers,optionID,pollID,currentDate) => baseapiwithheaders(headers).post(`user-poll-option-votes/${optionID}/poll/${pollID}`,{current_date : currentDate})
  const deleteVoteOnPoll = (headers,optionVoteID,currentDate) => baseapiwithheaders(headers).delete(`user-poll-option-votes/${optionVoteID}`,{current_date : currentDate})
  const addCommentOnPoll = (headers,pollID,commentBody,currentDate) => baseapiwithheaders(headers).post(`user-poll-comments/${pollID}`,{current_date : currentDate, body : commentBody})
  const deleteCommentOnPoll = (headers,pollCommentID,currentDate) => baseapiwithheaders(headers).delete(`user-poll-comments/${pollCommentID}`,{current_date : currentDate})
  const updateCommentOnPoll = (headers,pollCommentID,commentBody,currentDate) => baseapiwithheaders(headers).put(`user-poll-comments/${pollCommentID}`,{body : commentBody, current_date : currentDate})
  const homeScreenData = (headers,userID,currentDate,filterValue) => baseapiwithheaders(headers).get(`user-polls/${userID}/main?current_date=${currentDate}&filter=${filterValue}`)
  const addExperienceOnPoll = (headers,pollID,currentDate,experience,action) => baseapiwithheaders(headers).post(`user-polls/${pollID}/experience`,{current_date : currentDate, experience : experience,action : action})
  const getAllPollsOfUser = (headers,userID,currentDate,filterValue) => baseapiwithheaders(headers).get(`user-polls/${userID}/all?current_date=${currentDate}&filter=${filterValue}`)
  const endPoll = (headers,pollID,currentDate) => baseapiwithheaders(headers).post(`user-polls/${pollID}/endpoll`,{current_date : currentDate})
  const updateViewOnFriendsPoll = (headers,userID,pollID,notificationValue,hidePollValue,currentDate) => baseapiwithheaders(headers).post(`user-poll-settings/${userID}/poll/${pollID}`,{allow_notification : notificationValue, hide_poll : hidePollValue, current_date : currentDate})

  return {
    registration,
    registrationtoken,
    postLogin,
    resetPassword,
    verifyResetPasswordCode,
    newPasswordSetup,
    getDefaultInterests,
    saveUserInterests,
    getUserData,
    updateProfileInfo,
    updateUserInterestsEditProfile,
    searchUser,
    addFriend,
    viewProfileOtherUser,
    deleteFriendRequest,
    getNotifications,
    userAcceptOrDeclineRequest,
    getAllUserInformation,
    getAllRequestsOfUser,
    createPoll,
    viewPollDetails,
    updatePoll,
    addVoteToPoll,
    deleteVoteOnPoll,
    addCommentOnPoll,
    deleteCommentOnPoll,
    updateCommentOnPoll,
    viewNotification,
    homeScreenData,
    addExperienceOnPoll,
    getAllPollsOfUser,
    endPoll,
    updateViewOnFriendsPoll
  }
}

export default {
  create
}
