import React, { useState, useEffect } from 'react';
import { Settings, X, Clock, User, Zap } from 'lucide-react';

const DotsAndBoxes = () => {
    const [gridSize, setGridSize] = useState(5);
    const [horizontalLines, setHorizontalLines] = useState(
        Array(5).fill(null).map(() => Array(4).fill(false))
    );
    const [verticalLines, setVerticalLines] = useState(
        Array(4).fill(null).map(() => Array(5).fill(false))
    );
    const [boxes, setBoxes] = useState(
        Array(4).fill(null).map(() => Array(4).fill(null))
    );
    const [currentPlayer, setCurrentPlayer] = useState('player');
    const [scores, setScores] = useState({ player: 0, bot: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Settings
    const [playerName, setPlayerName] = useState('You');
    const [timeLimit, setTimeLimit] = useState(0); // 0 means no limit
    const [autoComplete, setAutoComplete] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const checkBox = (row, col, newHLines, newVLines) => {
        if (row < 0 || row >= gridSize - 1 || col < 0 || col >= gridSize - 1) return false;

        return newHLines[row][col] && newHLines[row + 1][col] &&
            newVLines[row][col] && newVLines[row][col + 1];
    };

    const countBoxSides = (row, col, hLines, vLines) => {
        if (row < 0 || row >= gridSize - 1 || col < 0 || col >= gridSize - 1) return 0;

        let count = 0;
        if (hLines[row][col]) count++;
        if (hLines[row + 1][col]) count++;
        if (vLines[row][col]) count++;
        if (vLines[row][col + 1]) count++;
        return count;
    };

    const findCompletableBoxes = (hLines, vLines) => {
        const moves = [];

        // Check horizontal lines
        for (let i = 0; i < hLines.length; i++) {
            for (let j = 0; j < hLines[i].length; j++) {
                if (!hLines[i][j]) {
                    const testHLines = hLines.map(r => [...r]);
                    testHLines[i][j] = true;

                    const boxesToCheck = [[i - 1, j], [i, j]];
                    if (boxesToCheck.some(([r, c]) => checkBox(r, c, testHLines, vLines) && boxes[r]?.[c] === null)) {
                        moves.push({ type: 'horizontal', row: i, col: j });
                    }
                }
            }
        }

        // Check vertical lines
        for (let i = 0; i < vLines.length; i++) {
            for (let j = 0; j < vLines[i].length; j++) {
                if (!vLines[i][j]) {
                    const testVLines = vLines.map(r => [...r]);
                    testVLines[i][j] = true;

                    const boxesToCheck = [[i, j - 1], [i, j]];
                    if (boxesToCheck.some(([r, c]) => checkBox(r, c, hLines, testVLines) && boxes[r]?.[c] === null)) {
                        moves.push({ type: 'vertical', row: i, col: j });
                    }
                }
            }
        }

        return moves;
    };

    // Timer effect
    useEffect(() => {
        if (timeLimit > 0 && currentPlayer === 'player' && !gameOver) {
            setTimeRemaining(timeLimit);

            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Auto-switch to bot if time runs out
                        setCurrentPlayer('bot');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentPlayer, timeLimit, gameOver]);

    // Auto-complete effect
    useEffect(() => {
        if (autoComplete && currentPlayer === 'player' && !gameOver) {
            const completableMoves = findCompletableBoxes(horizontalLines, verticalLines);
            if (completableMoves.length > 0) {
                const move = completableMoves[0];
                setTimeout(() => makeMove(move.type, move.row, move.col), 300);
            }
        }
    }, [horizontalLines, verticalLines, currentPlayer, autoComplete, gameOver]);

    const handleLineClick = (type, row, col) => {
        if (gameOver || currentPlayer === 'bot') return;

        if (type === 'horizontal' && horizontalLines[row][col]) return;
        if (type === 'vertical' && verticalLines[row][col]) return;

        makeMove(type, row, col);
    };

    const makeMove = (type, row, col) => {
        const newHLines = horizontalLines.map(r => [...r]);
        const newVLines = verticalLines.map(r => [...r]);
        const newBoxes = boxes.map(r => [...r]);

        if (type === 'horizontal') {
            newHLines[row][col] = true;
        } else {
            newVLines[row][col] = true;
        }

        let boxCompleted = false;
        let newScores = { ...scores };

        // Check boxes that might be completed
        const boxesToCheck = type === 'horizontal'
            ? [[row - 1, col], [row, col]]
            : [[row, col - 1], [row, col]];

        boxesToCheck.forEach(([r, c]) => {
            if (checkBox(r, c, newHLines, newVLines) && newBoxes[r]?.[c] === null) {
                newBoxes[r][c] = currentPlayer;
                newScores[currentPlayer]++;
                boxCompleted = true;
            }
        });

        setHorizontalLines(newHLines);
        setVerticalLines(newVLines);
        setBoxes(newBoxes);
        setScores(newScores);

        // Check if game is over
        const totalBoxes = (gridSize - 1) * (gridSize - 1);
        if (newScores.player + newScores.bot === totalBoxes) {
            setGameOver(true);
            return;
        }

        // If no box completed, switch player
        if (!boxCompleted) {
            const nextPlayer = currentPlayer === 'player' ? 'bot' : 'player';
            setCurrentPlayer(nextPlayer);
        } else {
            // Box completed, same player continues
            if (currentPlayer === 'bot') {
                setTimeout(() => {
                    setCurrentPlayer('player');
                    setTimeout(() => setCurrentPlayer('bot'), 50);
                }, 500);
            }
        }
    };

    const botMove = () => {
        const availableMoves = [];

        // Collect all available moves
        for (let i = 0; i < horizontalLines.length; i++) {
            for (let j = 0; j < horizontalLines[i].length; j++) {
                if (!horizontalLines[i][j]) {
                    availableMoves.push({ type: 'horizontal', row: i, col: j });
                }
            }
        }
        for (let i = 0; i < verticalLines.length; i++) {
            for (let j = 0; j < verticalLines[i].length; j++) {
                if (!verticalLines[i][j]) {
                    availableMoves.push({ type: 'vertical', row: i, col: j });
                }
            }
        }

        if (availableMoves.length === 0) return;

        // Intelligent AI strategy
        let bestMove = null;

        // Priority 1: Complete a box if possible
        const completableMoves = findCompletableBoxes(horizontalLines, verticalLines);
        if (completableMoves.length > 0) {
            bestMove = completableMoves[0];
        } else {
            // Priority 2: Avoid moves that give opponent a box
            const safeMoves = availableMoves.filter(move => {
                const testHLines = horizontalLines.map(r => [...r]);
                const testVLines = verticalLines.map(r => [...r]);

                if (move.type === 'horizontal') {
                    testHLines[move.row][move.col] = true;
                } else {
                    testVLines[move.row][move.col] = true;
                }

                const boxesToCheck = move.type === 'horizontal'
                    ? [[move.row - 1, move.col], [move.row, move.col]]
                    : [[move.row, move.col - 1], [move.row, move.col]];

                // Check if this move creates a 3-sided box for opponent
                return !boxesToCheck.some(([r, c]) => {
                    if (r < 0 || r >= gridSize - 1 || c < 0 || c >= gridSize - 1) return false;
                    const sides = countBoxSides(r, c, testHLines, testVLines);
                    return sides === 3 && boxes[r]?.[c] === null;
                });
            });

            // If there are safe moves, pick one randomly
            if (safeMoves.length > 0) {
                bestMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
            } else {
                // No safe moves, pick the least bad option (creates fewest 3-sided boxes)
                let minThreeSided = Infinity;
                availableMoves.forEach(move => {
                    const testHLines = horizontalLines.map(r => [...r]);
                    const testVLines = verticalLines.map(r => [...r]);

                    if (move.type === 'horizontal') {
                        testHLines[move.row][move.col] = true;
                    } else {
                        testVLines[move.row][move.col] = true;
                    }

                    let threeSidedCount = 0;
                    for (let r = 0; r < gridSize - 1; r++) {
                        for (let c = 0; c < gridSize - 1; c++) {
                            if (countBoxSides(r, c, testHLines, testVLines) === 3 && boxes[r]?.[c] === null) {
                                threeSidedCount++;
                            }
                        }
                    }

                    if (threeSidedCount < minThreeSided) {
                        minThreeSided = threeSidedCount;
                        bestMove = move;
                    }
                });
            }
        }

        const moveToMake = bestMove || availableMoves[Math.floor(Math.random() * availableMoves.length)];
        setTimeout(() => makeMove(moveToMake.type, moveToMake.row, moveToMake.col), 500);
    };

    useEffect(() => {
        if (currentPlayer === 'bot' && !gameOver) {
            botMove();
        }
    }, [currentPlayer, gameOver]);

    const resetGame = () => {
        setHorizontalLines(Array(gridSize).fill(null).map(() => Array(gridSize - 1).fill(false)));
        setVerticalLines(Array(gridSize - 1).fill(null).map(() => Array(gridSize).fill(false)));
        setBoxes(Array(gridSize - 1).fill(null).map(() => Array(gridSize - 1).fill(null)));
        setCurrentPlayer('player');
        setScores({ player: 0, bot: 0 });
        setGameOver(false);
        setTimeRemaining(timeLimit);
    };

    const handleGridSizeChange = (newSize) => {
        setGridSize(newSize);
        setHorizontalLines(Array(newSize).fill(null).map(() => Array(newSize - 1).fill(false)));
        setVerticalLines(Array(newSize - 1).fill(null).map(() => Array(newSize).fill(false)));
        setBoxes(Array(newSize - 1).fill(null).map(() => Array(newSize - 1).fill(null)));
        setCurrentPlayer('player');
        setScores({ player: 0, bot: 0 });
        setGameOver(false);
        setTimeRemaining(timeLimit);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Settings className="w-6 h-6 text-gray-600" />
                </button>

                <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Dots and Boxes</h1>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-indigo-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-200 rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4" />
                                    Player Name
                                </label>
                                <input
                                    type="text"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    Grid Size
                                </label>
                                <select
                                    value={gridSize}
                                    onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={3}>3x3 (Easy)</option>
                                    <option value={4}>4x4 (Medium)</option>
                                    <option value={5}>5x5 (Standard)</option>
                                    <option value={6}>6x6 (Hard)</option>
                                    <option value={7}>7x7 (Expert)</option>
                                    <option value={8}>8x8 (Extreme)</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4" />
                                    Time Limit per Turn (seconds)
                                </label>
                                <select
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={0}>No Limit</option>
                                    <option value={10}>10 seconds</option>
                                    <option value={15}>15 seconds</option>
                                    <option value={30}>30 seconds</option>
                                    <option value={60}>60 seconds</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoComplete}
                                        onChange={(e) => setAutoComplete(e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">Auto-complete available boxes</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mb-6">
                    <div className="text-center flex-1">
                        <div className={`text-lg font-semibold ${currentPlayer === 'player' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {playerName}
                            {currentPlayer === 'player' && timeLimit > 0 && (
                                <div className="text-sm mt-1 flex items-center justify-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {timeRemaining}s
                                </div>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{scores.player}</div>
                    </div>
                    <div className="text-center flex-1">
                        <div className={`text-lg font-semibold ${currentPlayer === 'bot' ? 'text-red-600' : 'text-gray-600'}`}>
                            Bot
                        </div>
                        <div className="text-3xl font-bold text-red-600">{scores.bot}</div>
                    </div>
                </div>

                {gameOver && (
                    <div className="text-center mb-4 p-4 bg-yellow-100 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-800">
                            {scores.player > scores.bot ? '🎉 ' + playerName + ' Wins!' : scores.bot > scores.player ? '🤖 Bot Wins!' : "It's a Tie!"}
                        </div>
                    </div>
                )}

                <div className="flex justify-center mb-6">
                    <div className="inline-block bg-gray-50 p-6 rounded-xl overflow-auto max-h-[600px]">
                        {Array(gridSize).fill(null).map((_, rowIdx) => (
                            <div key={`row-${rowIdx}`}>
                                <div className="flex">
                                    {Array(gridSize).fill(null).map((_, colIdx) => (
                                        <React.Fragment key={`dot-${rowIdx}-${colIdx}`}>
                                            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                                            {colIdx < gridSize - 1 && (
                                                <div
                                                    className={`w-16 h-3 flex items-center justify-center cursor-pointer transition-all ${horizontalLines[rowIdx][colIdx]
                                                        ? 'bg-indigo-600'
                                                        : 'bg-gray-300 hover:bg-indigo-400'
                                                        }`}
                                                    onClick={() => handleLineClick('horizontal', rowIdx, colIdx)}
                                                >
                                                    <div className={`w-full h-1 ${horizontalLines[rowIdx][colIdx] ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {rowIdx < gridSize - 1 && (
                                    <div className="flex">
                                        {Array(gridSize).fill(null).map((_, colIdx) => (
                                            <React.Fragment key={`vline-${rowIdx}-${colIdx}`}>
                                                <div
                                                    className={`w-3 h-16 flex items-center justify-center cursor-pointer transition-all ${verticalLines[rowIdx][colIdx]
                                                        ? 'bg-indigo-600'
                                                        : 'bg-gray-300 hover:bg-indigo-400'
                                                        }`}
                                                    onClick={() => handleLineClick('vertical', rowIdx, colIdx)}
                                                >
                                                    <div className={`h-full w-1 ${verticalLines[rowIdx][colIdx] ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                                                </div>
                                                {colIdx < gridSize - 1 && (
                                                    <div className="w-16 h-16 flex items-center justify-center relative">
                                                        {boxes[rowIdx][colIdx] && (
                                                            <div className={`absolute inset-0 m-1 rounded ${boxes[rowIdx][colIdx] === 'player' ? 'bg-blue-400' : 'bg-red-400'
                                                                } flex items-center justify-center text-white font-bold text-xl`}>
                                                                {boxes[rowIdx][colIdx] === 'player' ? '😊' : '🤖'}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={resetGame}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DotsAndBoxes;