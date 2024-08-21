import React from 'react'
import "./page1.css"
import { Link } from 'react-router-dom'

const page1 = () => {
  return (
    <div className="page ">
      <div className='head-box'>
        <Link to="/Topic" className="create">
          <div >

            <h1>
              Create Your Own Blogs
            </h1>


          </div>
        </Link>
        <Link to="/account" className="create">
          <div >

            <h1>
              Add to existing Blogs
            </h1>


          </div>
        </Link>


      </div>
      <hr />
    </div>

  )
}

export default page1;
