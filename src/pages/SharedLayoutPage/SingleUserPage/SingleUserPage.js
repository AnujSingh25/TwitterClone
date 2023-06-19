import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTweetContext } from '../../../context/auth/TweetContext'
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal'
import './SingleUserPage.css'

const SingleUserPage = () => {

    const [singleUser, setSingleUser] = useState();
    const { getSingleUserDetails, showSingleTweet, fetchDetailsOfTweetToCommentOn, sendRequestToBackendToReTweeet, sendDeleteRequestToBackend, auth, sendLikeRequest, allTweets } = useTweetContext()

    const [reloadSingleTweet, setReloadSingleTweet] = useState(false)

    const params = useParams()
    const id = params.id;

    const navigate = useNavigate()

    const fetchSingleUserDetails = async (id) => {
        const { data } = await axios.get(`/user/getSingleUser/${id}`)
        if (data) setSingleUser(data)
    }

    if (!singleUser) fetchSingleUserDetails(id)

    const sendFollowRequestToTheBackend = async (follower, userToFollow) => {
        if (follower === userToFollow) {
            toast.error('Oops! You cannot follow yourself')
            return
        }

        const { data } = await axios.post(`/tweet/follow/${follower}/${userToFollow}`)
        fetchSingleUserDetails(id)
        if (data?.userToUnfollow) toast.success('user unfollowed successfully')
        if (data?.userToFollow) toast.success('user followed successfully')
    }

    useEffect(() => {
        fetchSingleUserDetails(id)
        getSingleUserDetails()
    }, [allTweets])

    if (id === auth?.user?.userId) navigate('/profile')

    return (

        <div class="profile">
            <div class="feed-header d-flex justify-content-between align-items-center">
                <h2>Profile</h2>
            </div>

            <div class="profile-details border border-white">
                <div class="profile-followbtn d-flex justify-content-between align-items-center">
                    <div class="profile-information" >
                        <center >
                            <div style={{ maxWidth: "12rem" }}>
                                {singleUser?.user?.profile_picture ?
                                    <img style={{ borderRadius: "50%", objectFit: 'contain', width: "100%" }} src={singleUser?.user?.profile_picture} alt="" /> :
                                    <img style={{ borderRadius: "50%" }} src={require('../images/images/blank-profile-picture.webp')} alt="" />
                                }
                            </div>
                        </center>

                        <div class="profile-name">
                            <h2>{singleUser?.user?.name}</h2>
                            <span>@{singleUser?.user?.username}</span>
                        </div>
                        <div class="profile-username"> </div>

                    </div>

                    <button type="button" onClick={() => sendFollowRequestToTheBackend(auth?.user?.userId, params.id)} class="btn btn-dark">
                        <span>{singleUser?.user?.followers.find(({ user }) => user === auth?.user?.userId) ?
                            'Unfollow' : 'Follow'}</span>
                    </button>

                </div>

                <div class="other-details">
                    <div class="birthday-location d-flex">
                        <div class="birthday">
                            <i class="fa-solid fa-cake-candles"></i>
                            <span>Dob:</span>
                            <span id="dob">Tue Jan 03 2002</span>
                        </div>
                        <div class="location">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>Location:</span>
                            <span id="location">Haryana,India</span>
                        </div>
                    </div>
                    <div class="joining-date">
                        <i class="fa-regular fa-calendar"></i>
                        <span>Joined:</span>
                        <span id="joining">Wed Jan 23 2023</span>
                    </div>
                </div>

                <div class="followersandfollowing d-flex">
                    <div class="following">
                        <span id="Following">{singleUser?.user?.following.length}</span>
                        <span>Following</span>
                    </div>
                    <div class="followers">
                        <span id="Followers">{singleUser?.user?.followers.length}</span>
                        <span>Followers</span>
                    </div>

                </div>

                <div class="headingoftweetsprofiloe">
                    <center>
                        <h4>Tweets and Replies</h4>
                    </center>
                </div>

                {singleUser?.tweetsByThisUser && singleUser?.tweetsByThisUser.map((singleTweet) => {
                    return (
                        <div class="single-feed">
                            <div class="tweet-header d-flex ">
                                <div class="user-profile-img-container">
                                    {singleUser?.user?.profile_picture ?
                                        <img src={singleUser?.user?.profile_picture} alt="" /> :
                                        <img src={require('../images/images/blank-profile-picture.webp')} alt="" />
                                    }
                                </div>
                                <div class="username-container">
                                    <span class="username">@{singleUser?.user?.username}</span>
                                </div>
                                <div class="date-container">
                                    <span class="date">{moment(singleTweet?.createdAt).fromNow()}</span>
                                </div>

                                {auth?.user?.userId === singleUser?.user?._id && <div class="delete-icon-container" onClick={() => sendDeleteRequestToBackend(singleTweet?._id)}>
                                    <i class="fa-solid fa-trash-can"></i>
                                </div>}
                                <div onClick={() => showSingleTweet(singleTweet._id)} style={{ marginLeft: "auto" }}>
                                    <i class='fa-solid fa-info' style={{ "border": "1px solid black", "padding": "1rem", "borderRadius": "50%" }}></i></div>

                            </div>
                            <div class="single-tweet-text">
                                <span>{singleTweet?.content}</span>
                            </div>

                            {singleTweet?.image && <div class="single-tweet-img-container">
                                <img src={singleTweet?.image} />
                            </div>}
                            <div class="tweet-operations  d-flex gap-4">
                                <div class="like-icon-container" onClick={() => sendLikeRequest(singleTweet?._id)}>
                                    <i className={`${singleTweet.likes.map(({ user }) => {
                                        if (user === auth?.user?.userId) {
                                            return `fa-heart fa-solid`
                                        }
                                        else {
                                            return "fa-heart fa-regular"
                                        }
                                    })
                                        } ${singleTweet?.likes?.length === 0 && 'fa-regular fa-heart'}`} >
                                    </i>
                                    <span>{singleTweet.likes.length}</span>
                                </div>
                                <div class="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(singleTweet._id)}>
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal2" >
                                        <i class="fa-regular fa-comment"></i>
                                        <span>{singleTweet.comments.length}</span>
                                    </a>

                                </div>

                                <div class="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(singleTweet?._id)}>
                                    <i class="fa-solid fa-retweet"></i>
                                    <span>{singleTweet.reTweetedBy.length}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
            <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
        </div>
    )
}

export default SingleUserPage