import { useRef, useEffect } from 'react';
import classes from './style.module.css';
import CanvasDraw from 'react-canvas-draw';
import Button from '../../UI/Button';
import axios from 'axios';
import { message } from 'antd';

const Guessing = (props) => {
  const loadCanvasRef = useRef();
  const guessInputRef = useRef();
  const sessionId = props.sessionId;

  const playerId = sessionStorage.getItem('playerId');

  useEffect(() => {
    if (props.drawData) {
      onLoadHandler();
    }
  }, [props.drawData]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (guessInputRef.current.value.trim().length === 0) {
      message.error('Empty field is invalid input.', 1);
      return;
    }
    //check the guessed word.
    axios
      .post(`${props.apiUrl}/api/guess/attempt`, {
        sessionId,
        playerId,
        hostTurn: !props.hostTurn,
        guessedWord: guessInputRef.current.value,
      })
      .then(({ data: isCorrect }) => {
        if (isCorrect) {
          props.pickWordStateHandler(false); //so when turns switch => enable choosing a word.
          message.success('You guessed it right!', 2);
          message.success('Now you are the artist.', 2);
        } else {
          message.warning('Incorrect, try again', 1);
        }
        guessInputRef.current.value = '';
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };

  const onLoadHandler = () => {
    axios
      .post(`${props.apiUrl}/api/get/saved/draw`, {
        sessionId,
      })
      .then(({ data: drawData }) => {
        //data returned as object, loadSaveData expect a string(a convertion is done)
        loadCanvasRef.current.loadSaveData(JSON.stringify(drawData));
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };

  return (
    <div className={classes.guess}>
      <CanvasDraw ref={loadCanvasRef} disabled hideGrid />
      <form className={classes['guess-form']} onSubmit={submitHandler}>
        <input
          type='text'
          id='guessing-input'
          placeholder='Type you guess here..'
          ref={guessInputRef}
        />
        <Button className={classes.btn} type='submit'>
          Check
        </Button>
      </form>
    </div>
  );
};

export default Guessing;
