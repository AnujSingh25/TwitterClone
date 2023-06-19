import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTweetContext } from '../../../context/auth/TweetContext'

const CreateTweetModal = () => {

    const { auth, getAllTweets } = useTweetContext()
    const [file, setFile] = useState()

    const tweetObject = {
        content: '',
        tweetedBy: auth?.user?.userId
    }

    const [tweet, setTweet] = useState(tweetObject)

    const handleFileChange = async (e) => {

        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0]
        }
        setFile(img)
    }

    const handleChangeFromCreateTweetTextArea = (e) => {
        setTweet({ ...tweet, [e.target.name]: e.target.value })
    }

    const sendPostRequestToBackendToCreateTweet = async () => {
        let image_url = ''
        const formData = new FormData();
        formData.append('file', file?.data)

        const { data } = await axios.post('/tweet/uploadPictureToCloud', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        { (data?.error) ? toast.error(data?.error) : image_url = data?.imgURL }

        const finalTweetObjectToSendToBackend = { tweet, image: image_url?.url || null }

        try {

            const { data } = await axios.post('/tweet/createTweet', { ...finalTweetObjectToSendToBackend }, {})

            if (data?.error) {
                toast.error(data?.error)
            } else {
                toast.success("Tweet Created Successfully")
                setFile('')
                setTweet(tweetObject)
                getAllTweets()
            }
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Tweet Your Status</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <textarea class="new-tweet" onChange={handleChangeFromCreateTweetTextArea} name="content" id="" cols="45" rows="5" placeholder="Create Tweet" />
                        {file?.preview && <img src={file?.preview} width='100px' height='110px' />}
                    </div>
                    <div class="upload-image-div">
                        <input type="file" name='file' onChange={handleFileChange} />
                        <i class="fa-regular fa-image"></i>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" data-bs-dismiss="modal" onClick={() => sendPostRequestToBackendToCreateTweet()} class="btn btn-primary tweet-btn-2">Tweet</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateTweetModal