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
      message.error('Empty field is invalid input.');
      return;
    }
    //check the guessed word.
    axios
      .post(`${props.apiUrl}/api/guess/attempt`, {
        sessionId,
        guessedWord: guessInputRef.current.value,
      })
      .then(({ data: isCorrect }) => {
        if (isCorrect) {
          //update score.
          axios
            .put(`${props.apiUrl}/api/update/player/score`, {
              sessionId,
              playerId,
              correctWord: guessInputRef.current.value,
            })
            .then(() => {
              //switch turns.
              axios
                .put(`${props.apiUrl}/api/switch/player/turn`, {
                  sessionId,
                  hostTurn: !props.hostTurn,
                })
                .then(() => {
                  //reset drew image.
                  axios.put(`${props.apiUrl}/api/update/drawings`, {
                    drawData: null,
                    sessionId,
                  });
                });
              props.pickWordStateHandler(false); //so when turns switch => enable choosing a word.
              message.success('You guessed it right!', 2);
              message.success('Now you are the artist.', 2);
            });
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
      <form onSubmit={submitHandler}>
        <label htmlFor='guessing-input'></label>
        <input type='text' id='guessing-input' ref={guessInputRef} />
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  );
};

export default Guessing;
