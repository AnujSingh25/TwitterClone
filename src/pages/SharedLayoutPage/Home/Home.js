import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTweetContext } from '../../../context/auth/TweetContext';
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import CreateTweetModal from '../Tweet/CreateTweetModal';
import moment from 'moment'
import './Home.css'

const Home = () => {

    const [auth, setAuth] = useAuth();

    const { setTweetToAddACommentOn, tweetToAddACommentOn } = useTweetContext()
    const [reloadSingleTweet, setReloadSingleTweet] = useState(false)
    const ref = useRef(null);

    const { allTweets, getAllTweets, tweetsFromFollowingUsers } = useTweetContext()

    const followingTweetIds = tweetsFromFollowingUsers?.map((tweet) => {
        return tweet?.tweetedBy?._id;
    })

    const navigate = useNavigate()

    const sendRequestToBackendToReTweeet = async (id) => {

        const { data } = await axios.post(`/tweet/createReTweet/${id}`)

        if (data?.error) {
            toast.error(data?.error)
        }
        else if (data?.createNewTweetAsRetweet) {
            toast.success('retweeted Successfully')
        }
        getAllTweets()
    }


    const sendDeleteRequestToBackend = async (id) => {

        const { data } = await axios.delete(`/tweet/deleteTweet/${id}`)

        if (data?.error) {
            toast.error(data?.error)
        } else {
            (data?.deletedReplies) && toast.success(`Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`)
            toast.success('Tweet Deleted Successfully');
            getAllTweets();
        }
    }

    const showSingleTweet = (id) => {
        navigate(`/tweet/${id}`)
    }

    const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const { data } = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)
    }

    const fetchUserDetails = async (userId) => {
        navigate(`/profile/${userId}`)
    }

    const sendLikeRequest = async (id) => {
        const { data } = await axios.put(`/tweet/likeTweet/${id}`)

        if (data?.error) {
            toast.error(data?.error)
        } else {
            if (data?.like) toast.info("Tweet Liked Successfully")
            if (!data?.like) toast.info("Tweet Unliked Successfully")
            getAllTweets()
        }
    }

    useEffect(() => {
        getAllTweets();
    }, [])

    return (
        <>
            <div class="feed " ref={ref} style={{ "minWidth": "40rem" }}>

                <div class="feed-header d-flex justify-content-between align-items-center">
                    <h2>Home</h2>
                    <button type="button" class="btn btn-primary tweet-btn" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">
                        Tweet
                    </button>
                </div>

                {allTweets.length === 0 && <h1 style={{ "textAlign": "center" }}>No Tweets</h1>}

                {
                    allTweets &&
                    allTweets.map((singleTweet, index) => {
                        if (singleTweet?.isAReply) return;
                        return (
                            <div class="single-feed">
                                {singleTweet?.isARetweet && <p style={{ color: "blue", fontStyle: "italic" }}>ReTweeted By : @{singleTweet?.thisTweetIsRetweetedBy?.username}</p>}
                                <div class="tweet-header d-flex ">

                                    <div class="user-profile-img-container">
                                        {singleTweet?.tweetedBy?.profile_picture ? <img src={singleTweet?.tweetedBy?.profile_picture} style={{ width: "100%" }} alt="" /> : <img src={require('../images/images/blank-profile-picture.webp')} />}
                                    </div>

                                    <div className="username-container" onClick={() => fetchUserDetails(singleTweet?.tweetedBy._id)}>
                                        <span className="username">@{singleTweet?.tweetedBy?.username}</span>
                                    </div>

                                    <div class="date-container">
                                        <span class="date">
                                            {moment(singleTweet?.createdAt).fromNow()}
                                        </span>
                                    </div>

                                    <div class="delete-icon-container d-flex justify-content-between align-items-center"
                                        style={{ "marginRight": "2rem", "width": "5rem", }}
                                    >

                                        {singleTweet?.thisTweetIsRetweetedBy?._id === auth?.user?.userId && <i onClick={() => sendDeleteRequestToBackend(singleTweet._id)} class="fa-solid fa-trash-can"></i>}

                                        {auth?.user?.userId === singleTweet?.tweetedBy?._id && !singleTweet?.isARetweet &&
                                            <i onClick={() => sendDeleteRequestToBackend(singleTweet._id)} class="fa-solid fa-trash-can"></i>}

                                        <div onClick={() => showSingleTweet(singleTweet._id)}>
                                            <i class='fa-solid fa-info' style={{ "border": "1px solid black", "padding": "1rem", "borderRadius": "50%" }}></i>
                                        </div>
                                    </div>

                                </div>

                                <div class="single-tweet-text">
                                    <span>{singleTweet.content}</span>
                                </div>

                                {singleTweet?.image && (
                                    <div class="single-tweet-img-container">
                                        <img src={singleTweet?.image} alt="" />
                                    </div>
                                )}

                                <div class="tweet-operations  d-flex gap-4">
                                    <div class="like-icon-container" onClick={() => sendLikeRequest(singleTweet._id)}>
                                        <a ><i className={`${singleTweet.likes.map(({ user }) => {

                                            if (user === auth?.user?.userId) {
                                                return `fa-heart fa-solid`
                                            }
                                            else {
                                                return "fa-heart fa-regular"
                                            }
                                        })
                                            } ${singleTweet?.likes?.length === 0 && 'fa-regular fa-heart'}`}>

                                        </i>
                                            <span>{singleTweet?.likes?.length}</span></a>
                                    </div>

                                    <div class="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(singleTweet._id)} >
                                        <a data-bs-toggle="modal"
                                            data-bs-target="#exampleModal2" ><i class="fa-regular fa-comment"></i>
                                            <span>{singleTweet?.replies?.length}</span>
                                        </a>
                                    </div>

                                    <div class="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(singleTweet._id)}>
                                        <i class="fa-solid fa-retweet"></i>
                                        <span>{singleTweet?.reTweetedBy?.length}</span>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
            <CreateTweetModal />
            <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
        </>
    )
}

export default Home