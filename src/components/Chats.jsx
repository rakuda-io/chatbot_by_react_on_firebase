import React from 'react'
import List from '@mui/material/List';
import { Chat } from './index';

const Chats = (props) => {
return (
  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    {props.chats.map((value, index) => {
      return <Chat text={value.text} type={value.type} key={index.toString()} />
    })}
  </List>
)
}

export default Chats
