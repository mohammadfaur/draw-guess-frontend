import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from './style.module.css';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

const Drawing = () => {
  const [brushRadius, setBrushRadius] = useState(10);
  const [brushColor, setBrushColor] = useState('#ffc600');
  const [data, setData] = useState(null);
  const canvasRef = useRef();
  const { id: sessionId } = useParams();

  const onSendHandler = () => {
    axios.put(`${REACT_APP_API_URL}/api/update/drawings`, {
      drawData: data,
      sessionId,
    });
  };

  const brushRadiusChangeHandler = (event) => {
    setBrushRadius(() => setBrushRadius(parseInt(event.target.value, 10)));
  };

  const onColorChange = (event) => setBrushColor(() => event.target.value);

  const clearHandle = () => canvasRef.current.clear();

  const undoHandle = () => canvasRef.current.undo();

  const canvasChangeHandler = (event) => setData(() => event.getSaveData());

  console.log(canvasRef);
  return (
    <div className={classes.canvas}>
      <div className={classes['brush-radius']}>
        <label htmlFor='brush-radius'>Brush Radious:</label>
        <input
          type='number'
          id='brush-radius'
          onChange={brushRadiusChangeHandler}
          value={brushRadius}
        />
      </div>
      <div className={classes['color-picker']}>
        <label htmlFor='color-picker'>Color Picker:</label>
        <input
          type='color'
          id='color-picker'
          value={brushColor}
          onChange={onColorChange}
        />
      </div>
      <div className={classes['canvas-control-buttons']}>
        <button onClick={clearHandle}>Clear</button>
        <button onClick={undoHandle}>Undo</button>
      </div>
      <CanvasDraw
        ref={canvasRef}
        brushRadius={brushRadius}
        brushColor={brushColor}
        onChange={canvasChangeHandler}
      />
      <div className={classes['send-button']}>
        <button onClick={onSendHandler}>Send</button>
        {/* onClick fetch data */}
      </div>
    </div>
  );
};

export default Drawing;
