import React from 'react'
import Page1 from "../components/Home/page1"
import Page2 from "../components/Home/page2"
import Page3 from "../components/Home/page3"
import axios from "axios";
import "./home.css"

function Home() {
  







  return (
    <div className='page container'>
      <div className='noti'>
        <p>Flat 25% sale is started  .  Buy two get one free</p>
      </div>

      <Page1 />
      <div className='d-flex justify-content-center align-items-center my-4 latest'>
        <h1>Latest Blogs</h1>
      </div>
      <Page2/>
      <h1 className='d-flex justify-content-center align-items-center my-4 latest'>Sales Goes here.....</h1>
      <Page3/>
      


    </div>
  )
}

export default Home