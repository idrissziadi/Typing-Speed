import React, { useState, useEffect } from 'react';
import './SpeedTypingGame.css';

const SpeedTypingGame = () => {
    const paragraphs = [
        "Les technologies évoluent rapidement et transforment notre quotidien de manière spectaculaire. Chaque jour, nous assistons à de nouvelles innovations qui rendent nos vies plus faciles et plus connectées. Que ce soit dans le domaine de l'intelligence artificielle, des véhicules autonomes ou des technologies de communication, les avancées sont constantes. Il est essentiel de rester informé et adaptable pour tirer le meilleur parti de ces évolutions et maintenir une longueur d'avance dans un monde en perpétuel changement."
        // Ajoutez plus de paragraphes pour varier les tests
    ];

    const [text, setText] = useState('');
    const [typingText, setTypingText] = useState([]);
    const [inpFieldValue, setInpFieldValue] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTyping, setIsTyping] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [difficulty, setDifficulty] = useState('medium'); // default difficulty

    useEffect(() => {
        if (isTyping && timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;
                    updateStats();
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(interval);
        } else if (timeLeft === 0) {
            setIsTyping(false);
        }
    }, [isTyping, timeLeft]);

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        setText(paragraphs[ranIndex]);
        setTypingText(paragraphs[ranIndex].split(' ').map((word, index) => (
            <span key={index} className="word">{word} </span>
        )));
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setShowWelcomeMessage(false); // Hide welcome message once the game starts
    };

    const handleChange = (event) => {
        const typedText = event.target.value;
        const words = text.split(' ');
        const typedWords = typedText.split(' ');

        setInpFieldValue(typedText);
        setTypingText(words.map((word, index) => {
            const typedWord = typedWords[index] || '';
            if (typedWord === word) {
                return <span key={index} className="word correct">{word} </span>;
            } else if (typedWord !== word && typedWord.length > 0) {
                return <span key={index} className="word incorrect">{word} </span>;
            } else {
                return <span key={index} className="word">{word} </span>;
            }
        }));

        setCharIndex(typedText.length);
        setMistakes(typedWords.reduce((acc, typedWord, index) => {
            if (typedWord !== words[index] && typedWord.length > 0) {
                return acc + 1;
            }
            return acc;
        }, 0));
    };

    const updateStats = () => {
        const cpm = Math.max(0, (charIndex - mistakes) * (60 / (60 - timeLeft)));
        setCPM(parseInt(cpm, 10));
        const wpm = Math.max(0, Math.round(((charIndex - mistakes) / 5) / (60 - timeLeft) * 60));
        setWPM(wpm);
    };

    const startGame = () => {
        loadParagraph();
        setIsTyping(true);
        setTimeLeft(60);
        setCharIndex(0);
        setMistakes(0);
    };

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(60);
        setCharIndex(0);
        setMistakes(0);
        setTypingText([]);
        setCPM(0);
        setWPM(0);
        setInpFieldValue('');
        setText('');
        setShowWelcomeMessage(true);
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    return (
        <div className="container">
            {showWelcomeMessage && (
                <div className="welcome-message">
                    <h1>Welcome to the Speed Typing Game!</h1>
                    <p>Type the text as quickly and accurately as possible. Good luck!</p>
                </div>
            )}
            <textarea
                className="input-field"
                value={inpFieldValue}
                onChange={handleChange}
                onFocus={() => setIsTyping(true)}
                placeholder="Start typing here..."
                disabled={!isTyping}
            />
            <div className="typing-text">
                {typingText}
            </div>
            <div className="stats">
                <div className="stats-item">
                    <h2>Time Left</h2>
                    <p>{timeLeft}s</p>
                </div>
                <div className="stats-item">
                    <h2>Mistakes</h2>
                    <p>{mistakes}</p>
                </div>
                <div className="stats-item">
                    <h2>WPM</h2>
                    <p>{WPM}</p>
                </div>
                <div className="stats-item">
                    <h2>CPM</h2>
                    <p>{CPM}</p>
                </div>
            </div>
            <button className="start-btn" onClick={startGame}>Start Game</button>
            <button className="reset-btn" onClick={resetGame}>Reset</button>
            <div className="difficulty-selector">
                <label>
                    Difficulty:
                    <select value={difficulty} onChange={handleDifficultyChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default SpeedTypingGame;
