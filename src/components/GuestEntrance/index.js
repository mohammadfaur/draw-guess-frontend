import { useRef } from 'react';
import classes from './style.module.css';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { message } from 'antd';
import axios from 'axios';

const GuestEntrance = (props) => {
  const guestNameInputRef = useRef();
  const sessionId = props.sessionId;

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredName = guestNameInputRef.current.value;
    if (!enteredName.trim().length || enteredName.trim().length > 25) {
      message.error(
        'Empty name or long name are invalid, Please enter a valid name.'
      );
      return;
    }
    axios
      .put(`${props.apiUrl}/api/enter/guest/name`, {
        sessionId,
        playerName: enteredName,
      })
      .then(({ data }) => {
        props.setPlayerType('guest');
        message.success('Welcome..', 1);
        sessionStorage.setItem('sessionId', sessionId);
        sessionStorage.setItem('playerId', JSON.stringify(data.guestId));
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };
  return (
    <Card className={classes['guest-entrance-card']}>
      <form className={classes['guest-entrance']} onSubmit={submitHandler}>
        <div>
          <label htmlFor='name'>Enter You Name:</label>
          <input type='text' id='name' ref={guestNameInputRef} />
        </div>
        <Button type='submit'>Join Game</Button>
      </form>
    </Card>
  );
};

export default GuestEntrance;
