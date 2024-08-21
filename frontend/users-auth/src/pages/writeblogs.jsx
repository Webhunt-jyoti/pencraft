import React from 'react'
import Writeblogs from "../components/writeblogs/writeblogs"
import Chatgpt from '../components/chatgpt/chatgpt';

const writeblogs = ({title}) => {
  return (
    <div>
        <Writeblogs titlename={title}/>
        <Chatgpt />
      
    </div>
  )
}

export default writeblogs
