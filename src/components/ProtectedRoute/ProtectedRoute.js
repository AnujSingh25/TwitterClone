import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('auth')) {
      toast.warning("Please login to continue", {
        toastId: "please login to continue post"
      })
      return navigate('/login')
    }
  }, []);

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoute