import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTweetContext } from '../../../context/auth/TweetContext';
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import './SingleTweetPage.css'

const SingleTweetPage = () => {

    const { auth, setTweetToAddACommentOn, tweetToAddACommentOn, sendRequestToBackendToReTweeet } = useTweetContext()
    const [singleTweet, setSingleTweet] = useState()
    const [reloadSingleTweet, setReloadSingleTweet] = useState(false)

    const params = useParams()
    const navigate = useNavigate()
    const id = params.id;

    const date = moment(singleTweet?.createdAt).fromNow()

    const sendLikeRequest = async (id) => {

        const { data } = await axios.put(`/tweet/likeTweet/${id}`)

        if (data?.error) {
            toast.error(data?.error)
        } else {

            if (data?.like) toast.info("Tweet Liked Successfully")

            if (!data?.like) toast.info("Tweet Unliked Successfully")

            getSingleTweetDetails()
        }
    }

    const sendDeleteRequestToBackend = async (id) => {

        const { data } = await axios.delete(`/tweet/deleteTweet/${id}`);

        if (data?.error) {
            toast.error(data?.error)
        } else {
            if (data?.deletedTweetNotAReply) navigate('/')
            toast.success('Comment Deleted Successfully')
            if (data?.deletedTweet) navigate(`/tweet/${data?.parentTweet}`)
            getSingleTweetDetails()
        }
        setReloadSingleTweet(!reloadSingleTweet)
    }

    const showSingleTweet = async (id) => {
        getSingleTweetDetails();
        navigate(`/tweet/${id}`)
    }

    const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const { data } = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)
    }

    const getSingleTweetDetails = async () => {
        const { data } = await axios.get(`/tweet/getSingleTweet/${id}`)
            (data?.singleTweet) && setSingleTweet(data?.singleTweet)
    }

    if (!singleTweet) getSingleTweetDetails()

    useEffect(() => {
        getSingleTweetDetails()
    }, [id, tweetToAddACommentOn, reloadSingleTweet])


    if (!singleTweet) return <h1 style={{ marginTop: "4rem" }}>No tweets to show</h1>

    return (

        <div>
            <div class="single-feed" style={{ "marginTop": "6.6rem", "minWidth": "45rem" }}>
                <div class="tweet-header d-flex ">
                    {
                        singleTweet?.tweetedBy?.profile_picture ? (<div class="user-profile-img-container">
                            <img src={singleTweet?.tweetedBy?.profile_picture} alt="" />
                        </div>) : (<div class="user-profile-img-container">
                            <img src={require('../images/images/blank-profile-picture.webp')} alt="" />
                        </div>)
                    }

                    <div className="username-container">
                        <span className="username">{singleTweet?.tweetedBy?.username}</span>
                    </div>

                    <div class="date-container">
                        <span class="date">{date}</span>
                    </div>

                    {singleTweet?.tweetedBy?._id === auth?.user?.userId && (<div class="delete-icon-container" onClick={() => sendDeleteRequestToBackend(singleTweet._id)}>
                        <i class="fa-solid fa-trash-can"></i>
                    </div>)}

                </div>

                <div class="single-tweet-text">
                    <span>{singleTweet?.content}</span>
                </div>

                {singleTweet?.image && (<div class="single-tweet-img-container">
                    <img src={singleTweet?.image} alt="" />
                </div>)}

                <div class="tweet-operations  d-flex gap-4">
                    <div class="like-icon-container" >
                        <a ><i onClick={() => sendLikeRequest(singleTweet._id)} className={`${singleTweet?.likes.map(({ user }) => {
                            if (user === auth?.user?.userId) {
                                return `fa-heart fa-solid`
                            }
                            else {
                                return "fa-heart fa-regular"
                            }
                        })} ${singleTweet?.likes?.length === 0 && 'fa-regular fa-heart'}`}></i>
                            <span>{singleTweet?.likes?.length}</span>
                        </a>
                    </div>

                    <div class="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(singleTweet._id)}  >
                        <a data-bs-toggle="modal"
                            data-bs-target="#exampleModal2" ><i class="fa-regular fa-comment"></i>
                            <span>{singleTweet?.replies?.length}</span></a>
                    </div>

                    <div class="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(singleTweet?._id)}>
                        <i class="fa-solid fa-retweet"></i>
                        <span>{singleTweet?.reTweetedBy?.length}</span>
                    </div>
                </div>

                <div>
                </div>

                {
                    singleTweet?.replies.map((reply, index) => {

                        if (reply?.reply === null) {
                            return
                        }
                        return <div style={{ marginLeft: "2rem", marginTop: "2rem" }}>

                            <span style={{ "marginLeft": "3rem", "fontWeight": "bold" }}>@{reply?.reply?.tweetedBy?.username}</span><span style={{ marginLeft: "1rem" }}>{moment(reply?.reply?.createdAt).fromNow()}</span>
                            <div style={{ 'marginTop': index == 0 && "1rem" }} class="single-tweet-text fw-light d-flex justify-content-start align-items-center">
                                {
                                    reply?.reply?.tweetedBy?.profile_picture ? <div class="user-profile-img-container">
                                        <img src={reply?.reply?.tweetedBy?.profile_picture} alt="" />
                                    </div> : <div class="user-profile-img-container">
                                        <img src={require('../images/images/blank-profile-picture.webp')} alt="" />
                                    </div>
                                }
                                <span className='ms-5'>{reply?.reply?.content}</span>
                                {auth?.user?.userId === reply?.reply?.tweetedBy?._id && <div style={{ marginRight: "3rem", border: "1px solid blue" }} class="delete-icon-container">
                                    <i class="fa-solid fa-trash-can" onClick={() => sendDeleteRequestToBackend(reply?.reply?._id)}></i>
                                </div>}
                                <span className='ms-5' style={{ border: "1px solid black", borderRadius: "20px", padding: "1rem" }} onClick={() => showSingleTweet(reply?.reply?._id)}>
                                    <i class="fa-solid fa-info" ></i>
                                </span>
                            </div>

                            <div class="tweet-operations  d-flex gap-4">
                                <div class="like-icon-container">
                                    <a ><i className={`
                                ${reply?.reply?.likes.map(({ user }) => {
                                        if (user === auth?.user?.userId) {
                                            return `fa-heart fa-solid`
                                        }
                                        else {
                                            return "fa-heart fa-regular"
                                        }
                                    })
                                        }
                                         ${reply?.reply?.likes?.length === 0 && 'fa-regular fa-heart'}
                                `

                                    }
                                        onClick={() => sendLikeRequest(reply?.reply?._id)}>
                                    </i>
                                        <span>{reply?.reply?.likes?.length}</span>
                                    </a>
                                </div>
                                <div class="comment-icon-container" onClick={() => fetchDetailsOfTweetToCommentOn(reply?.reply?._id)}  >
                                    <a data-bs-toggle="modal" data-bs-target="#exampleModal2" >
                                        <i class="fa-regular fa-comment"></i>
                                        <span>{reply?.reply?.replies?.length}</span>
                                    </a>
                                </div>

                                <div class="retweet-icon-container" onClick={() => sendRequestToBackendToReTweeet(reply?.reply?._id)}>
                                    <i class="fa-solid fa-retweet"></i>
                                    <span>0</span>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

            <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet} />
        </div>
    )
}

export default SingleTweetPage