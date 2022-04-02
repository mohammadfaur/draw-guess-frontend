import { Fragment, useEffect, useReducer } from 'react';
import { useParams, useNavigate, Redirect } from 'react-router-dom';
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
  intervalID: null,
};

const gameDataReducer = (state, action) => {
  if (action.type === 'HTTP_REQUEST') {
    return { ...state, ...action.data };
  }
  if (action.type === 'SET_PLAYER_TYPE') {
    return { ...state, playerType: action.playerType };
  }
  if (action.type === 'WORD_IS_SET') {
    return { ...state, wordPicked: action.booleanState };
  }
  if (action.type === 'SET_INTERVAL_ID') {
    return { ...state, intervalID: action.id };
  }
  return defaultGameDataState;
};

const GameSession = (props) => {
  const [gameData, dispatchGameAction] = useReducer(
    gameDataReducer,
    defaultGameDataState
  );
  const { id: sessionId } = useParams();
  const goTo = useNavigate();

  const {
    guestId,
    hostName,
    guestName,
    playerType,
    status,
    hostTurn,
    drawData,
    wordPicked,
    intervalID,
  } = gameData;

  const onFetchGameDataHandler = (data) => {
    dispatchGameAction({ type: 'HTTP_REQUEST', data: data });
  };

  const playerTypeHandler = (type) => {
    dispatchGameAction({ type: 'SET_PLAYER_TYPE', playerType: type });
  };

  const pickWordHandler = (value) => {
    dispatchGameAction({ type: 'WORD_IS_SET', booleanState: value });
  };

  const intervalIdHandler = (id) => {
    dispatchGameAction({ type: 'SET_INTERVAL_ID', id: id });
  };

  useEffect(() => {
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      fetch(`${props.apiUrl}/api/update/session/status`, {
        method: 'PUT',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          status: 'expired',
        }),
      }).catch((error) => {
        console.error(error);
        alert(error.message);
      });
    };

    return () => (window.onbeforeunload = null);
  }, []);

  useEffect(() => {
    playerTypeHandler(props.playerType);
  }, [props.playerType]);

  useEffect(() => {
    //an api reuest will be fired every 2 seconds.
    //intervalID will be stored in the session game state to clear the interval when a session expires.
    if (status === 'pending') {
      const identifier = setInterval(() => {
        intervalIdHandler(identifier);
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
    }

    if (status === 'expired') {
      goTo('/');
      message.error(
        'Game session has been ended, you can create a new one.',
        3
      );
      return () => {
        clearInterval(intervalID);
      };
    }
  }, [sessionId, status, props.apiUrl]);

  if (!playerType && status === 'pending') {
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

  return (
    <Fragment>
      <p>Unlikable Access</p>
      <button
        onClick={() => {
          clearInterval(intervalID);
          goTo('/');
        }}
      >
        Redirect
      </button>
    </Fragment>
  );
};

export default GameSession;
