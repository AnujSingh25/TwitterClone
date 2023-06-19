import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../../context/auth/AuthContext'
import './EditProfileDetailsModal.css'

const userProfileDetailsObject = {
    name: '',
    location: '',
    date_of_birth: ''
}

const EditProfileDetailsModal = ({ currentUser }) => {

    const userProfileDetailsObject = {
        name: currentUser?.user?.name,
        location: currentUser?.user?.location,
        date_of_birth: currentUser?.user?.DateOfBirth
    }

    const [userProfileDetails, setUserProfileDetails] = useState(userProfileDetailsObject)
    const [auth, setAuth] = useAuth()

    const [name, setName] = useState(userProfileDetails.name)
    const [location, setLocation] = useState(userProfileDetails.location);
    const [date_of_birth, setDate_of_birth] = useState(userProfileDetails.date_of_birth)

    const sendRequestToBackendToUpdateProfileDetails = async (id) => {

        const { data } = await axios.post(`/user/updateUserProfileDetails/${id}`, { name, location, date_of_birth })

        if (data?.error) return toast.error(data?.error)

        if (data?.user) {
            setUserProfileDetails(userProfileDetailsObject)
            localStorage.setItem('auth', JSON.stringify(data));
            window.location.reload()
        }
    }

    return (
        <div class="modal fade" id="exampleModal4" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Profile Details</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex align-items-center gap-3 fs-4">
                        <label>Name</label>
                        <input className="new-tweet" value={name} name="name" onChange={(e) => setName(e.target.value)} cols="60" rows="5" placeholder="Name" />
                    </div>
                    <div class="modal-body d-flex align-items-center gap-3 fs-4">
                        <label>Location</label>
                        <input className="new-tweet" value={location} name='location' onChange={(e) => setLocation(e.target.value)} cols="60" rows="5" placeholder="Location" />
                    </div>
                    <div class="modal-body d-flex align-items-center gap-3 fs-4">
                        <label>DOB</label>
                        <input className="new-tweet" value={date_of_birth} onChange={(e) => setDate_of_birth(e.target.value)} name="date_of_birth" type="date" cols="60" rows="5" placeholder="Add your reply" />
                    </div>
                    <div class="upload-image-div">

                        <i class="fa-regular fa-image"></i>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary tweet-btn-2" data-bs-dismiss="modal" onClick={() => sendRequestToBackendToUpdateProfileDetails(auth?.user?.userId)}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileDetailsModal