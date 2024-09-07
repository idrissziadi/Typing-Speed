import React, { useState, useEffect } from 'react';

const SpeedTypingGame = () => {
    const paragraphs = [
        "Les technologies évoluent rapidement et transforment notre quotidien de manière spectaculaire. Chaque jour, nous assistons à de nouvelles innovations qui rendent nos vies plus faciles et plus connectées. Que ce soit dans le domaine de l'intelligence artificielle, des véhicules autonomes ou des technologies de communication, les avancées sont constantes. Il est essentiel de rester informé et adaptable pour tirer le meilleur parti de ces évolutions et maintenir une longueur d'avance dans un monde en perpétuel changement."
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

    const loadParagraph = () => {
        if (paragraphs.length === 0) {
            console.error('No paragraphs available');
            return;
        }
        
        const ranIndex = Math.floor(Math.random() * paragraphs.length);
        setText(paragraphs[ranIndex]);
        setInpFieldValue('');
        setCharIndex(0);
        setMistakes(0);
        setIsTyping(false);
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

        // Update charIndex and mistakes
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
    };

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4 text-white">
            <div className="w-full max-w-2xl bg-white text-black p-8 rounded-lg shadow-lg animate-fadeInUp mb-4">
                <textarea
                    className="w-full h-32 p-4 mb-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
                    value={inpFieldValue}
                    onChange={handleChange}
                    onFocus={() => setIsTyping(true)}
                    placeholder="Start typing here..."
                    disabled={!isTyping}
                />
                <div className="text-xl leading-relaxed text-left overflow-y-scroll h-40 typing-text animate-appear transition-all duration-700 ease-in-out">
                    {typingText}
                </div>
            </div>
            <div className="flex justify-center space-x-8 mb-6 text-center">
                <div className="animate-pulse text-white">
                    <h2 className="text-2xl font-bold">Time Left</h2>
                    <p className="text-4xl">{timeLeft}s</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Mistakes</h2>
                    <p className="text-4xl">{mistakes}</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">WPM</h2>
                    <p className="text-4xl">{WPM}</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">CPM</h2>
                    <p className="text-4xl">{CPM}</p>
                </div>
            </div>
            <div className="space-x-4">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
                    onClick={startGame}
                >
                    Start Game
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
                    onClick={resetGame}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default SpeedTypingGame;
