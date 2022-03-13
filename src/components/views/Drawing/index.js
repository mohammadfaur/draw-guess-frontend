import { useRef, useState } from 'react';
import classes from './style.module.css';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import { message } from 'antd';

const Drawing = (props) => {
  const [brushRadius, setBrushRadius] = useState(3);
  const [brushColor, setBrushColor] = useState('#105789');
  const [data, setData] = useState(null);
  const canvasRef = useRef();
  const sessionId = props.sessionId;

  const onSendHandler = () => {
    axios
      .put(`${props.apiUrl}/api/update/drawings`, {
        drawData: data,
        sessionId,
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };

  const brushRadiusChangeHandler = (event) => {
    setBrushRadius(() => setBrushRadius(parseInt(event.target.value, 10)));
  };

  const onColorChange = (event) => setBrushColor(() => event.target.value);

  const clearHandle = () => canvasRef.current.clear();

  const undoHandle = () => canvasRef.current.undo();

  const canvasChangeHandler = (event) => setData(() => event.getSaveData());

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
