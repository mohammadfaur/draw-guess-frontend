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
  hostTurn: true,
  drawData: null,
  hostId: null,
  guestId: null,
  hostName: '',
  hostScore: 0,
  guestName: '',
  guestScore: 0,
  playerType: '',
  wordPicked: false,
};

const gameDataReducer = (state, action) => {
  if (action.type === 'HTTP_REQUEST') {
    return { ...state, ...action.data };
  }
  if (action.type === 'SET_PLAYER_TYPE') {
    return { ...state, playerType: action.playerType };
  }
  if (action.type === 'SET_WORD') {
    return { ...state, wordPicked: action.hide };
  }
  return defaultGameDataState;
};

const GameSession = (props) => {
  const [gameData, dispatchGameAction] = useReducer(
    gameDataReducer,
    defaultGameDataState
  );
  const { id: sessionId } = useParams();

  const {
    guestId,
    hostName,
    guestName,
    playerType,
    status,
    hostTurn,
    drawData,
    wordPicked,
  } = gameData;

  const onFetchGameDataHandler = (data) => {
    dispatchGameAction({ type: 'HTTP_REQUEST', data: data });
  };

  const playerTypeHandler = (type) => {
    dispatchGameAction({ type: 'SET_PLAYER_TYPE', playerType: type });
  };

  const pickWordHandler = (value) => {
    dispatchGameAction({ type: 'SET_WORD', hide: value });
  };

  useEffect(() => {
    playerTypeHandler(props.playerType);
  }, [props.playerType]);

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
        apiUrl={props.apiUrl}
        sessionId={sessionId}
        guestId={guestId}
        hostName={hostName}
        guestName={guestName}
      />
    );
  }
  if (status === 'live') {
    if (hostTurn && playerType === 'guest') {
      return (
        <Guessing
          drawData={drawData}
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          hostTurn={hostTurn}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }
    if (!hostTurn && playerType === 'guest') {
      return wordPicked ? (
        <Drawing apiUrl={props.apiUrl} sessionId={sessionId} />
      ) : (
        <ChooseWord
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }
    if (hostTurn && playerType === 'host') {
      return wordPicked ? (
        <Drawing apiUrl={props.apiUrl} sessionId={sessionId} />
      ) : (
        <ChooseWord
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }
    if (!hostTurn && playerType === 'host') {
      return (
        <Guessing
          drawData={drawData}
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          hostTurn={hostTurn}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }
  }

  return <h1>why I'm here</h1>;
};

export default GameSession;
