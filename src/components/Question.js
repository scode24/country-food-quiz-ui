import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Question.css'
import { publicApiBase, allowedMaxWrongCount, negativeScore, positiveScore, timeLimitPerQuestion } from '../Environment';

function Question() {

    const navigate = useNavigate();
    const [timer, setTimer] = useState(timeLimitPerQuestion);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState();
    const [questionId, setQuestionId] = useState();
    const [options, setOptions] = useState([]);
    const [wrongCount, setWrongCount] = useState(allowedMaxWrongCount);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameOverText, setGameOverText] = useState('Game Over');
    const startUpFnRef = useRef();
    const timeCounterRef = useRef();
    var counter;

    const checkAnswer = (answer) => {
        const isCorrectAnswer = async (answer) => {
            const response = await fetch(publicApiBase + '/checkAnswer/' + questionId + '/' + answer, {
                method: 'post'
            });
            return await response.json();
        }

        isCorrectAnswer(answer).then(data => {
            if (data) {
                setIsCorrect(true);
                setScore(score + positiveScore);
                setIsAnswered(true);
                animate('scoreSpan');
            } else {
                if (wrongCount === 0) {
                    setIsGameOver(true);
                } else {
                    setIsAnswered(true);
                    if (score - negativeScore < 0) {
                        setScore(0);
                    } else {
                        setScore(score - negativeScore);
                    }
                    animate('scoreSpan');
                }
                setWrongCount(wrongCount - 1);
            }
        }).catch(error => {
            console.log(error)
        })

    }

    const loadNextQuestion = (username) => {
        const getNewQuestion = async (username) => {
            const response = await fetch(publicApiBase + '/nextQuestion', {
                headers: {
                    'username': username
                }
            });
            return await response.json();
        }

        // var data = await getNewQuestion(username);

        getNewQuestion(username).then(data => {
            console.log(data);
            if (data.questionId !== -1) {
                setQuestion(data.question);
                setOptions(data.options);
                setQuestionId(data.questionId);
                setIsCorrect(false);
                setIsAnswered(false);
                setIsGameOver(false);
                setGameOverText('Game Over');
                setTimer(timeLimitPerQuestion);
                animate('questionSpan');
            } else {
                setIsGameOver(true);
                setGameOverText('Well Done ! Answered all question');
            }
        })
    }

    const animate = (elemId) => {
        var elem = document.getElementById(elemId);
        elem.classList.toggle('animate__bounceIn');
    }

    const clearUsernameAndInitGame = () => {
        const deleteUserApi = async () => {
            const response = await fetch(publicApiBase + '/initGame', {
                method: 'post',
                headers: {
                    'username': sessionStorage.getItem('username')
                }
            });

            return await response.json();
        }

        deleteUserApi().then(data => {
            navigate('/', { replace: true })
        }).catch(error => {
            console.log(error);
        })
    }


    const startupGame = () => {
        if (sessionStorage.getItem('username') === null) {
            navigate('/', { replace: true });
        }

        const isActiveUser = async (username) => {
            const response = await fetch(publicApiBase + '/checkUserActive', {
                headers: {
                    'username': username
                }
            });

            return await response.json();
        }

        isActiveUser(sessionStorage.getItem('username')).then(isActive => {
            if (isActive) {
                loadNextQuestion(sessionStorage.getItem('username'));
            } else {
                navigate('/', { replace: true });
            }
        })
    }

    startUpFnRef.current = startupGame;

    useEffect(() => {
        startUpFnRef.current();
    }, []);

    useEffect(() => {
        counter = setTimeout(() => { setTimer(timer - 1) }, 1000);
        if (isAnswered) {
            clearTimeout(counter);
        }
        if (timer === 0) {
            setIsGameOver(true);
            clearTimeout(counter);
        }
        return () => clearInterval(counter);
    })

    return (
        <div className='question-container'>
            <div className='header'>
                <span className='mediumFont animate__bounceIn'>Country Food Quiz</span>
                <span className='largeFont animate__bounceIn'>Score : <span id='scoreSpan'>{score}</span></span>
            </div>

            <div className='body'>
                {isGameOver ?
                    <><span className='mediumFont'>{gameOverText}</span></> :
                    <>
                        {isAnswered ?
                            <>
                                <span className='largeFont'>
                                    {isCorrect ? <>Correct</> : <>Wrong</>}
                                </span>
                            </> :
                            <>
                                This food is from which state ?
                                <span id='questionSpan' className='largeFont'>{question}</span>
                                <span className='mediumFont' style={{ margin: '10px' }}>
                                    {timer}s
                                </span>
                            </>
                        }
                    </>
                }

            </div>

            <div className='options'>
                {isGameOver ?
                    <>
                        <button onClick={() => clearUsernameAndInitGame()}>Play Again</button>
                    </> :
                    <>
                        {isAnswered ?
                            <>
                                <button onClick={() => loadNextQuestion(sessionStorage.getItem('username'))}>Next Question</button>
                            </> :
                            <>
                                {options.map((option, key) => (
                                    <button key={key} onClick={() => { checkAnswer(option) }}>{option}</button>
                                ))}
                            </>
                        }
                    </>
                }
            </div>

        </div>
    )
}

export default Question