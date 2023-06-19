import React from 'react'
import { useAuth } from '../../context/auth/AuthContext'

const Feed = () => {
  const [auth, setAuth] = useAuth();

  return (
    <div>
      <pre>
        {JSON.stringify(auth, null, 4)}
      </pre>
    </div>
  )
}

export default Feed