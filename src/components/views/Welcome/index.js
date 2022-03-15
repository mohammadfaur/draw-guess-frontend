import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './style.module.css';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import { message } from 'antd';
import TopTenPlayers from '../TopTenPlayers';

const Welcome = (props) => {
  const playNameInputRef = useRef();
  const goTo = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    const playerName = playNameInputRef.current.value;
    if (!playerName.trim().length || playerName.trim().length > 25) {
      message.error(
        'Empty name or too Long name are invalid, Please enter a valid name.'
      );
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
      <p className={classes.para}>Click create to make a new game session.</p>
      <form className={classes.form} onSubmit={submitHandler}>
        <div>
          <label htmlFor='name'>Enter You Name:</label>
          <input type='text' id='name' ref={playNameInputRef} />
        </div>
        <Button type='submit' className={classes.btn}>
          Create Game
        </Button>
      </form>
      <TopTenPlayers apiUrl={props.apiUrl} />
    </Card>
  );
};

export default Welcome;
