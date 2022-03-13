import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './style.module.css';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import { message } from 'antd';

const Welcome = (props) => {
  const playNameInputRef = useRef();
  const goTo = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    const playerName = playNameInputRef.current.value;
    if (!playerName) {
      message.error('Empty name is invalid, Please enter a valid name.');
      return;
    }
    axios
      .post(`${props.apiUrl}/api/sessions/new`, { playerName: playerName })
      .then(({ data }) => {
        props.updatePlayerType('host');
        sessionStorage.setItem('sessionId', data.sessionId);
        sessionStorage.setItem('playerId', data.playerId);
        message.success('A new game has been created..', 2);
        goTo(`game-room/${data.sessionId}`);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };
  return (
    <Card className={classes.welcome}>
      <h1>Draw &amp; Guess</h1>
      <p>Click create to make a new game session.</p>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor='name'>Enter You Name:</label>
          <input type='text' id='name' ref={playNameInputRef} />
        </div>
        <Button type='submit'>Create Game</Button>
      </form>
    </Card>
  );
};

export default Welcome;
