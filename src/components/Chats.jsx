import React from 'react'
import List from '@mui/material/List';
import { Chat } from './index';

const Chats = () => {
return (
  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    <Chat />
    <Chat />
    <Chat />
  </List>
)
}

export default Chats
