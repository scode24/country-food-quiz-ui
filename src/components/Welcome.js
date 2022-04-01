import React from 'react'
import '../styles/Welcome.css'
import 'animate.css';
import { useNavigate } from 'react-router-dom';
import { publicApiBase } from '../Environment';

export default function Welcome() {

    const navigate = useNavigate();

    const validateUsername = async (username) => {
        const response = await fetch(publicApiBase + '/validateAndInsertUsername', {
            headers: {
                'username': username,
            },
        });

        return await response.json();
    }

    const validateUsernameAndStartGame = async () => {
        var username = document.getElementById('username').value;
        if (username === '' || username === undefined) {
            alert('Please provide a username to proceed');
        } else {
            try {
                var isValid = await validateUsername(username);
                if (isValid) {
                    sessionStorage.setItem("username", username);
                    navigate('/question');
                } else {
                    alert('One player is active with this username at this moment. Please provide a different username.');
                }
            } catch (error) {
                alert(error);
            }
        }
    }

    return (
        <div className='container'>
            <div className='title-container animate__bounceIn'>
                <div className='title'>
                    <span className='mediumFont'>Country</span>
                    <span className='largeFont'>Food</span>
                    <span className='mediumFont'>Quiz</span>
                </div>
            </div>

            <input id='username' type="text" placeholder='Enter your name' style={{ marginTop: '50px' }} />
            <button style={{ marginTop: '20px' }} onClick={() => { validateUsernameAndStartGame() }}>Start Game</button>
        </div>
    )
}