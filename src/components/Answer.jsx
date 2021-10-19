import React from 'react';
import Button from '@mui/material/Button';

const Answer = (props) => {
  return (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => props.select(props.content, props.nextId)}
      >
        {props.content}
      </Button>
  )
}

export default Answer;