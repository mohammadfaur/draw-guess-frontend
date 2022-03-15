import { useState, useEffect } from 'react';
import classes from './style.module.css';
import Card from '../../UI/Card';
import { generateSlug } from 'random-word-slugs';
import axios from 'axios';
import { message } from 'antd';

const ChooseWord = (props) => {
  const [words, setWords] = useState(
    generateSlug(3, { format: 'title' }).split(' ')
  );
  const [selectedWord, setSelectedWord] = useState('');
  const sessionId = props.sessionId;

  useEffect(() => {
    if (selectedWord) {
      axios
        .put(`${props.apiUrl}/api/update/chosen/word`, {
          chosenWord: selectedWord,
          sessionId,
        })
        .then(() => {
          props.pickWordStateHandler(true);
        })
        .catch((error) => {
          console.error(error);
          if (error.response) {
            message.error(error.response.data);
          }
        });
    }

    // goTo(`${sessionId}/draw`);
  }, [selectedWord, sessionId]);

  const onSelectHandler = (event) => setSelectedWord(() => event.target.value);
  return (
    <Card className={classes['choose-words']}>
      <p>Pick a word from below to draw:</p>
      <div className={classes.words}>
        {words &&
          words.map((word) => (
            <div className={classes.choice} key={word}>
              <input
                type='radio'
                id={word}
                value={word}
                name='word'
                onChange={onSelectHandler}
              />
              <label htmlFor={word}>{word}</label>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default ChooseWord;
