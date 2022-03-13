import { Fragment, useState } from 'react';
import classes from './style.module.css';
import Card from '../../UI/Card';
import Button from '../../UI/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Spin, message } from 'antd';

const Waiting = (props) => {
  const [showElements, setShowElements] = useState(false);

  const showElementsHandler = (value) => setShowElements(() => value);

  if (props.playerType === 'host') {
    showElementsHandler(true);
  }

  if (props.playerType === 'guest') {
    showElementsHandler(false);
  }

  const sharedURL = window.location.href;

  let showSpinOrStart = (
    <Fragment>
      <Spin size='large' tip='Waiting for the second player...' />
      <input type='text' value={sharedURL} readOnly />
      {showElements && (
        <CopyToClipboard
          text={sharedURL}
          onCopy={() => message.success('Copied', 0.5)}
        >
          <button>Copy to clipboard</button>
        </CopyToClipboard>
      )}
    </Fragment>
  );

  //show start game only for the host
  if (showElements && props.guestId) {
    showSpinOrStart = <Button className={classes.btn}>Start Game</Button>;
  }

  return (
    <Card className={classes.waiting}>
      {props.hostName && (
        <Card className={classes.players}>{props.hostName}</Card>
      )}
      {props.guestName && (
        <Card className={classes.players}>{props.guestName}</Card>
      )}
      {showSpinOrStart}
    </Card>
  );
};

export default Waiting;
