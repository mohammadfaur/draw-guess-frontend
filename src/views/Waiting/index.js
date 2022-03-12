import { Fragment, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classes from './style.module.css';
import axios from 'axios';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Spin, message } from 'antd';

const { REACT_APP_API_URL } = process.env;

const Waiting = (props) => {
  const [sessionStatus, setSessionsStatus] = useState('pending');
  const [hostName, setHostName] = useState('');
  const [guestName, setGuestName] = useState('');
  const guestNameInputRef = useRef();
  const goTo = useNavigate();
  const { id: sessionId } = useParams();

  const access = sessionStorage.getItem('sessionId');
  console.log(guestName);

  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/api/session/${sessionId}`)
      .then(({ data }) => data)
      .then(({ status, hostName, hostId }) => {
        setSessionsStatus(() => status);
        setHostName(() => hostName);
        sessionStorage.setItem('hostId', hostId.toString());
      })
      .catch((error) => {
        if (error.response) {
          message.error(error.response.data);
          goTo('/');
        }
      });
  }, [sessionId, guestName]);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredName = guestNameInputRef.current.value;
    if (!enteredName) {
      message.error('Empty name is invalid, Please enter a valid name.');
      return;
    }
    if (sessionStatus === 'pending') {
      axios
        .put(`${REACT_APP_API_URL}/api/enter/guest/name`, {
          playerName: enteredName,
          sessionId: sessionId,
        })
        .then(() => {
          setGuestName(() => enteredName);
          setSessionsStatus(() => 'ready');
          sessionStorage.setItem('sessionId', sessionId.toString());
        })
        //access_token
        //session state change to ready
        .catch((error) => {
          if (error.response) {
            message.error(error.response.data);
            goTo('/');
          }
        });
    }
  };

  if (!guestName && !access) {
    return (
      <Card>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor='name'>Enter You Name:</label>
            <input type='text' id='name' ref={guestNameInputRef} />
          </div>
          <Button type='submit'>Confirm</Button>
        </form>
      </Card>
    );
  }

  const sharedURL = window.location.href;

  let showSpinOrStart = (
    <Fragment>
      <Spin size='large' tip='Waiting for the second player...' />
      <input type='text' value={sharedURL} readOnly />
      <CopyToClipboard
        text={sharedURL}
        onCopy={() => message.success('Copied', 0.5)}
      >
        <button>Copy to clipboard</button>
      </CopyToClipboard>
    </Fragment>
  );

  if (guestName) {
    showSpinOrStart = <Button className={classes.btn}>Start Game</Button>;
  }

  return (
    <Card className={classes.waiting}>
      {hostName && <Card className={classes.players}>{hostName}</Card>}
      {guestName && <Card className={classes.players}>{guestName}</Card>}
      {showSpinOrStart}
    </Card>
  );
};

export default Waiting;
