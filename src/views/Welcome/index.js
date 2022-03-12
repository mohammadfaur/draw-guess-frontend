import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './style.module.css';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { message } from 'antd';

const { REACT_APP_API_URL } = process.env;

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
      .post(`${REACT_APP_API_URL}/api/sessions/new`, { playerName: playerName })
      .then(({ data }) => {
        sessionStorage.setItem('sessionId', data.sessionId);
        message.success(
          'A new game is created, please wait until the second player joins..',
          3
        );
        goTo(`/${data.sessionId}/wait`);
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
