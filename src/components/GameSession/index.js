import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Drawing from '../views/Drawing';
import ChooseWord from '../views/ChooseWord';
import Guessing from '../views/Guessing';
import Waiting from '../views/Waiting';
import classes from './style.module.css';
import GuestEntrance from '../GuestEntrance';
import axios from 'axios';
import { message } from 'antd';

const defaultGameDataState = {
  sessionId: null,
  status: 'pending',
  hostId: null,
  guestId: null,
  hostName: '',
  hostScore: 0,
  guestName: '',
  guestScore: 0,
  playerType: '',
};

const gameDataReducer = (state, action) => {
  if (action.type === 'HTTP_REQUEST') {
    return { ...action.data, playerType: state.playerType };
  }
  if (action.type === 'SET_PLAYER_TYPE') {
    return { ...state, playerType: action.playerType };
  }
  return defaultGameDataState;
};

const GameSession = (props) => {
  const [gameData, dispatchGameAction] = useReducer(
    gameDataReducer,
    defaultGameDataState
  );
  const { id: sessionId } = useParams();

  const { guestId, hostName, guestName, playerType, status } = gameData;

  console.log(1);

  const onFetchGameDataHandler = (data) => {
    dispatchGameAction({ type: 'HTTP_REQUEST', data: data });
  };

  const playerTypeHandler = (type) => {
    dispatchGameAction({ type: 'SET_PLAYER_TYPE', playerType: type });
  };

  // useEffect(() => {
  //   playerTypeHandler(props.playerType);
  // }, [props.playerType]);

  useEffect(() => {
    setInterval(() => {
      axios
        .post(`${props.apiUrl}/api/session/data`, { sessionId })
        .then(({ data }) => {
          onFetchGameDataHandler(data);
        })
        .catch((error) => {
          console.error(error);
          if (error.response) {
            message.error(error.response.data);
          }
        });
    }, 2000);
  }, [sessionId, props.apiUrl]);

  if (!playerType) {
    return (
      <GuestEntrance
        setPlayerType={props.updatePlayerType}
        apiUrl={props.apiUrl}
        sessionId={sessionId}
      />
    );
  }
  if (status === 'pending') {
    return (
      <Waiting
        playerType={props.playerType}
        guestId={guestId}
        hostName={hostName}
        guestName={guestName}
      />
    );
  }

  return <h1>why I'm here</h1>;
};

export default GameSession;
