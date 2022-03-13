import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import classes from './style.module.css';
import CanvasDraw from 'react-canvas-draw';
import Button from '../../UI/Button';
import axios from 'axios';
import { message } from 'antd';

const { REACT_APP_API_URL } = process.env;

const Guessing = () => {
  const loadCanvasRef = useRef();
  const guessInputRef = useRef();
  const { id: sessionId } = useParams();

  const submitHandler = (event) => {
    event.preventDefault();
    if (guessInputRef.current.value.trim().length === 0) {
      message.error('Empty field is invalid input.');
      return;
    }
    axios
      .post(`${REACT_APP_API_URL}/api/guess/attempt`, {
        sessionId,
        guessedWord: guessInputRef.current.value,
      })
      .then(({ data: isCorrect }) => {
        console.log(isCorrect);
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
      .post(`${REACT_APP_API_URL}/api/get/saved/draw`, {
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
      <button onClick={onLoadHandler}>Load Saved Data</button>
      <CanvasDraw ref={loadCanvasRef} disabled hideGrid saveData={''} />
      <form onSubmit={submitHandler}>
        <label htmlFor='guessing-input'></label>
        <input type='text' id='guessing-input' ref={guessInputRef} />
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  );
};

export default Guessing;
