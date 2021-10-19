import React from 'react';
import Button from '@mui/material/Button';

const Answer = (props) => {
  return (
      <Button variant="contained" color="secondary">
        {props.content}
      </Button>
  )
}

export default Answer;