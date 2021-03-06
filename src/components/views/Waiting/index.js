import { Fragment, useState, useEffect } from 'react';
import classes from './style.module.css';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Spin, message } from 'antd';
import axios from 'axios';

const Waiting = (props) => {
  //showElements is determined according to playerType
  const [showElements, setShowElements] = useState(false);

  const showElementsHandler = (value) => setShowElements(() => value);

  const onStartHandler = () => {
    axios
      .put(`${props.apiUrl}/api/update/session/status`, {
        status: 'live',
        sessionId: props.sessionId,
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };

  useEffect(() => {
    if (props.playerType === 'host') {
      showElementsHandler(true);
    } else {
      showElementsHandler(false);
    }
  }, [props.playerType]);

  const sharedURL = window.location.href;

  let showSpinOrStart = (
    <Fragment>
      <Spin
        size='large'
        tip={
          showElements
            ? 'Waiting for the second player to join...'
            : 'Waiting for host to start game...'
        }
      />
      {showElements && (
        <div className={classes.clipboard}>
          <input type='text' value={sharedURL} readOnly />
          <CopyToClipboard
            text={sharedURL}
            onCopy={() => message.success('Copied', 0.5)}
          >
            <Button className={classes['copy-to-clipboard-btn']}>
              Copy to clipboard
            </Button>
          </CopyToClipboard>
        </div>
      )}
    </Fragment>
  );

  //show start game only for the host
  if (showElements && props.guestId) {
    showSpinOrStart = (
      <Button onClick={onStartHandler} className={classes.btn}>
        Start Game
      </Button>
    );
  }

  return (
    <Card className={classes.waiting}>
      {props.hostName && (
        <Card className={classes.players}>{props.hostName}</Card>
      )}
      {props.guestName && (
        <Card className={classes.players}>{props.guestName}</Card>
      )}
      <div className={classes['spin-or-button']}>{showSpinOrStart}</div>
    </Card>
  );
};

export default Waiting;
