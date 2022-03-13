import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './style.module.css';
import Card from '../../UI/Card';
import { generateSlug } from 'random-word-slugs';
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

const ChooseWord = () => {
  const [words, setWords] = useState(
    generateSlug(3, { format: 'title' }).split(' ')
  );
  const [selectedWord, setSelectedWord] = useState('');
  const goTo = useNavigate();
  const { id: sessionId } = useParams();

  useEffect(() => {
    if (selectedWord) {
      axios.put(`${REACT_APP_API_URL}/api/update/chosen/word`, {
        chosenWord: selectedWord,
        sessionId,
      });
    }

    // goTo(`${sessionId}/draw`);
  }, [selectedWord, sessionId]);

  const onSelectHandler = (event) => setSelectedWord(() => event.target.value);
  return (
    <Card className={classes.words}>
      <p>Please select a word to draw.</p>
      {words &&
        words.map((word) => (
          <div className={classes.choose} key={word}>
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
    </Card>
  );
};

export default ChooseWord;
