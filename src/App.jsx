import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Clock, User, Zap, Users, Wifi, Copy, Check } from 'lucide-react';

const DotsAndBoxes = () => {
  const [gameMode, setGameMode] = useState('menu');
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
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [timeLimit, setTimeLimit] = useState(0);
  const [autoComplete, setAutoComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [gameId, setGameId] = useState('');
  const [myPlayerId, setMyPlayerId] = useState('');
  const [showGameIdInput, setShowGameIdInput] = useState(false);
  const [joinGameIdInput, setJoinGameIdInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [botIsThinking, setBotIsThinking] = useState(false);

  const botTimeoutRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const generateGameId = () => {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  };

  const loadGameState = async (id) => {
    try {
      const result = await window.storage.get(`dots-boxes:${id}`, true);
      if (result) {
        const data = JSON.parse(result.value);
        setHorizontalLines(data.horizontalLines);
        setVerticalLines(data.verticalLines);
        setBoxes(data.boxes);
        setCurrentPlayer(data.currentPlayer);
        setScores(data.scores);
        setGameOver(data.gameOver);
        setGridSize(data.gridSize);
        setPlayer1Name(data.player1Name || 'Player 1');
        setPlayer2Name(data.player2Name || 'Player 2');
        setIsMyTurn(data.currentPlayer === myPlayerId);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Game not found');
      return false;
    }
  };

  const saveGameState = async (id, state) => {
    try {
      await window.storage.set(`dots-boxes:${id}`, JSON.stringify(state), true);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  useEffect(() => {
    if (gameMode === 'online' && gameId && !gameOver) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      
      pollIntervalRef.current = setInterval(() => {
        loadGameState(gameId);
      }, 2000);
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [gameMode, gameId, gameOver, myPlayerId]);

  const startOnlineGame = async () => {
    const newGameId = generateGameId();
    const newPlayerId = 'player1';
    setGameId(newGameId);
    setMyPlayerId(newPlayerId);
    setIsMyTurn(true);
    
    const initialState = {
      horizontalLines: Array(gridSize).fill(null).map(() => Array(gridSize - 1).fill(false)),
      verticalLines: Array(gridSize - 1).fill(null).map(() => Array(gridSize).fill(false)),
      boxes: Array(gridSize - 1).fill(null).map(() => Array(gridSize - 1).fill(null)),
      currentPlayer: 'player1',
      scores: { player1: 0, player2: 0 },
      gameOver: false,
      gridSize: gridSize,
      player1Name: player1Name,
      player2Name: player2Name
    };
    
    setHorizontalLines(initialState.horizontalLines);
    setVerticalLines(initialState.verticalLines);
    setBoxes(initialState.boxes);
    setCurrentPlayer('player1');
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
    
    await saveGameState(newGameId, initialState);
  };

  const joinOnlineGame = async (id) => {
    const success = await loadGameState(id);
    if (success) {
      setGameId(id);
      setMyPlayerId('player2');
      setIsMyTurn(false);
    } else {
      alert('Game not found! Please check the Game ID.');
    }
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkBox = (row, col, newHLines, newVLines) => {
    if (row < 0 || row >= gridSize - 1 || col < 0 || col >= gridSize - 1) return false;
    return newHLines[row][col] && newHLines[row + 1][col] && newVLines[row][col] && newVLines[row][col + 1];
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

  const findCompletableBoxes = (hLines, vLines, currentBoxes) => {
    const moves = [];
    
    for (let i = 0; i < hLines.length; i++) {
      for (let j = 0; j < hLines[i].length; j++) {
        if (!hLines[i][j]) {
          const testHLines = hLines.map(r => [...r]);
          testHLines[i][j] = true;
          const boxesToCheck = [[i - 1, j], [i, j]];
          if (boxesToCheck.some(([r, c]) => checkBox(r, c, testHLines, vLines) && currentBoxes[r]?.[c] === null)) {
            moves.push({ type: 'horizontal', row: i, col: j });
          }
        }
      }
    }
    
    for (let i = 0; i < vLines.length; i++) {
      for (let j = 0; j < vLines[i].length; j++) {
        if (!vLines[i][j]) {
          const testVLines = vLines.map(r => [...r]);
          testVLines[i][j] = true;
          const boxesToCheck = [[i, j - 1], [i, j]];
          if (boxesToCheck.some(([r, c]) => checkBox(r, c, hLines, testVLines) && currentBoxes[r]?.[c] === null)) {
            moves.push({ type: 'vertical', row: i, col: j });
          }
        }
      }
    }
    
    return moves;
  };

  const handleLineClick = (type, row, col) => {
    if (gameOver) return;
    if (gameMode === 'bot' && currentPlayer === 'player2') return;
    if (gameMode === 'online' && !isMyTurn) return;
    if (type === 'horizontal' && horizontalLines[row][col]) return;
    if (type === 'vertical' && verticalLines[row][col]) return;
    makeMove(type, row, col);
  };

  const makeMove = async (type, row, col) => {
    const newHLines = horizontalLines.map(r => [...r]);
    const newVLines = verticalLines.map(r => [...r]);
    const newBoxes = boxes.map(r => [...r]);

    if (type === 'horizontal') {
      if (newHLines[row][col]) return;
      newHLines[row][col] = true;
    } else {
      if (newVLines[row][col]) return;
      newVLines[row][col] = true;
    }

    let boxCompleted = false;
    let newScores = { ...scores };

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

    const totalBoxes = (gridSize - 1) * (gridSize - 1);
    const isGameOver = newScores.player1 + newScores.player2 === totalBoxes;
    setGameOver(isGameOver);

    let nextPlayer = currentPlayer;
    if (!boxCompleted && !isGameOver) {
      nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
      setCurrentPlayer(nextPlayer);
    }

    if (gameMode === 'online' && gameId) {
      const state = {
        horizontalLines: newHLines,
        verticalLines: newVLines,
        boxes: newBoxes,
        currentPlayer: nextPlayer,
        scores: newScores,
        gameOver: isGameOver,
        gridSize: gridSize,
        player1Name: player1Name,
        player2Name: player2Name
      };
      await saveGameState(gameId, state);
      setIsMyTurn(nextPlayer === myPlayerId);
    }

    if (gameMode === 'bot' && nextPlayer === 'player2' && !isGameOver && !botIsThinking) {
      setBotIsThinking(true);
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
      botTimeoutRef.current = setTimeout(() => {
        executeBotMove(newHLines, newVLines, newBoxes, newScores);
      }, 800);
    }
  };

  const executeBotMove = (currentHLines, currentVLines, currentBoxes, currentScores) => {
    const availableMoves = [];
    
    for (let i = 0; i < currentHLines.length; i++) {
      for (let j = 0; j < currentHLines[i].length; j++) {
        if (!currentHLines[i][j]) {
          availableMoves.push({ type: 'horizontal', row: i, col: j });
        }
      }
    }
    for (let i = 0; i < currentVLines.length; i++) {
      for (let j = 0; j < currentVLines[i].length; j++) {
        if (!currentVLines[i][j]) {
          availableMoves.push({ type: 'vertical', row: i, col: j });
        }
      }
    }

    if (availableMoves.length === 0) {
      setBotIsThinking(false);
      return;
    }

    const completableMoves = findCompletableBoxes(currentHLines, currentVLines, currentBoxes);
    let moveToMake;
    
    if (completableMoves.length > 0) {
      moveToMake = completableMoves[0];
    } else {
      const safeMoves = availableMoves.filter(move => {
        const testHLines = currentHLines.map(r => [...r]);
        const testVLines = currentVLines.map(r => [...r]);
        
        if (move.type === 'horizontal') {
          testHLines[move.row][move.col] = true;
        } else {
          testVLines[move.row][move.col] = true;
        }

        const boxesToCheck = move.type === 'horizontal'
          ? [[move.row - 1, move.col], [move.row, move.col]]
          : [[move.row, move.col - 1], [move.row, move.col]];

        return !boxesToCheck.some(([r, c]) => {
          if (r < 0 || r >= gridSize - 1 || c < 0 || c >= gridSize - 1) return false;
          const sides = countBoxSides(r, c, testHLines, testVLines);
          return sides === 3 && currentBoxes[r]?.[c] === null;
        });
      });

      moveToMake = safeMoves.length > 0 
        ? safeMoves[Math.floor(Math.random() * safeMoves.length)]
        : availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    setBotIsThinking(false);
    makeMove(moveToMake.type, moveToMake.row, moveToMake.col);
  };

  useEffect(() => {
    return () => {
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const resetGame = () => {
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    setHorizontalLines(Array(gridSize).fill(null).map(() => Array(gridSize - 1).fill(false)));
    setVerticalLines(Array(gridSize - 1).fill(null).map(() => Array(gridSize).fill(false)));
    setBoxes(Array(gridSize - 1).fill(null).map(() => Array(gridSize - 1).fill(null)));
    setCurrentPlayer('player1');
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
    setTimeRemaining(timeLimit);
    setGameId('');
    setMyPlayerId('');
    setIsMyTurn(false);
    setBotIsThinking(false);
  };

  const handleGridSizeChange = (newSize) => {
    setGridSize(newSize);
  };

  const getPlayerName = (player) => {
    if (gameMode === 'bot') {
      return player === 'player1' ? player1Name : 'Bot';
    }
    return player === 'player1' ? player1Name : player2Name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full relative">
        {gameMode !== 'menu' && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-indigo-600">Dots and Boxes</h1>
        
        {gameMode === 'menu' && !showGameIdInput && (
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">Choose Game Mode</h2>
            <button
              onClick={() => {
                setGameMode('bot');
                setCurrentPlayer('player1');
                resetGame();
              }}
              className="w-full p-4 bg-indigo-100 hover:bg-indigo-200 rounded-lg flex items-center gap-3 transition-colors"
            >
              <Zap className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <div className="font-bold">vs Bot</div>
                <div className="text-sm text-gray-600">Play against AI</div>
              </div>
            </button>
            <button
              onClick={() => {
                setGameMode('local');
                setCurrentPlayer('player1');
                resetGame();
              }}
              className="w-full p-4 bg-green-100 hover:bg-green-200 rounded-lg flex items-center gap-3 transition-colors"
            >
              <Users className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-bold">Local 2-Player</div>
                <div className="text-sm text-gray-600">Play on same device</div>
              </div>
            </button>
            <button
              onClick={() => setShowGameIdInput(true)}
              className="w-full p-4 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-3 transition-colors"
            >
              <Wifi className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-bold">Online Multiplayer</div>
                <div className="text-sm text-gray-600">Play turn-based online</div>
              </div>
            </button>
          </div>
        )}

        {showGameIdInput && (
          <div className="mb-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
            <h3 className="font-bold text-lg mb-4">Online Game</h3>
            <button
              onClick={async () => {
                setGameMode('online');
                await startOnlineGame();
                setShowGameIdInput(false);
              }}
              className="w-full mb-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Create New Game
            </button>
            <div className="text-center text-sm text-gray-600 my-2">or</div>
            <input
              type="text"
              placeholder="Enter Game ID to join"
              value={joinGameIdInput}
              onChange={(e) => setJoinGameIdInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            />
            <button
              onClick={async () => {
                if (joinGameIdInput.trim()) {
                  setGameMode('online');
                  await joinOnlineGame(joinGameIdInput.trim());
                  setShowGameIdInput(false);
                  setJoinGameIdInput('');
                }
              }}
              className="w-full mb-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Join Game
            </button>
            <button
              onClick={() => {
                setShowGameIdInput(false);
                setJoinGameIdInput('');
              }}
              className="w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        {gameMode === 'online' && gameId && myPlayerId === 'player1' && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium mb-2">Share this Game ID with your friend:</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={gameId}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={copyGameId}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

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
                  Player 1 Name
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {gameMode !== 'bot' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Player 2 Name
                  </label>
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Grid Size</label>
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
                </select>
              </div>
            </div>
          </div>
        )}

        {gameMode !== 'menu' && (
          <>
            <div className="flex justify-between mb-6">
              <div className="text-center flex-1">
                <div className={`text-lg font-semibold ${
                  currentPlayer === 'player1' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {getPlayerName('player1')}
                  {gameMode === 'online' && myPlayerId === 'player1' && ' (You)'}
                </div>
                <div className="text-3xl font-bold text-blue-600">{scores.player1}</div>
              </div>
              <div className="text-center flex-1">
                <div className={`text-lg font-semibold ${
                  currentPlayer === 'player2' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getPlayerName('player2')}
                  {gameMode === 'online' && myPlayerId === 'player2' && ' (You)'}
                </div>
                <div className="text-3xl font-bold text-red-600">{scores.player2}</div>
              </div>
            </div>

            {gameMode === 'online' && !isMyTurn && !gameOver && (
              <div className="text-center mb-4 p-3 bg-yellow-100 rounded-lg text-yellow-800 font-medium">
                Waiting for opponent's move...
              </div>
            )}

            {gameOver && (
              <div className="text-center mb-4 p-4 bg-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">
                  {scores.player1 > scores.player2 
                    ? '🎉 ' + getPlayerName('player1') + ' Wins!' 
                    : scores.player2 > scores.player1 
                    ? '🎉 ' + getPlayerName('player2') + ' Wins!' 
                    : "It's a Tie!"}
                </div>
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div className="inline-block bg-gray-50 p-4 md:p-6 rounded-xl overflow-auto max-h-[600px]">
                {Array(gridSize).fill(null).map((_, rowIdx) => (
                  <div key={`row-${rowIdx}`}>
                    <div className="flex">
                      {Array(gridSize).fill(null).map((_, colIdx) => (
                        <React.Fragment key={`dot-${rowIdx}-${colIdx}`}>
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-600 rounded-full" />
                          {colIdx < gridSize - 1 && (
                            <div
                              className={`w-12 h-2 md:w-16 md:h-3 flex items-center justify-center cursor-pointer transition-all ${
                                horizontalLines[rowIdx][colIdx] 
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
                              className={`w-2 h-12 md:w-3 md:h-16 flex items-center justify-center cursor-pointer transition-all ${
                                verticalLines[rowIdx][colIdx] 
                                  ? 'bg-indigo-600' 
                                  : 'bg-gray-300 hover:bg-indigo-400'
                              }`}
                              onClick={() => handleLineClick('vertical', rowIdx, colIdx)}
                            >
                              <div className={`h-full w-1 ${verticalLines[rowIdx][colIdx] ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                            </div>
                            {colIdx < gridSize - 1 && (
                              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center relative">
                                {boxes[rowIdx][colIdx] && (
                                  <div className={`absolute inset-0 m-1 rounded ${
                                    boxes[rowIdx][colIdx] === 'player1' ? 'bg-blue-400' : 'bg-red-400'
                                  } flex items-center justify-center text-white font-bold text-lg md:text-xl`}>
                                    {boxes[rowIdx][colIdx] === 'player1' ? '😊' : (gameMode === 'bot' ? '🤖' : '😎')}
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

            <div className="text-center space-x-3">
              <button
                onClick={resetGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 md:px-8 rounded-lg transition-colors"
              >
                New Game
              </button>
              <button
                onClick={() => {
                  setGameMode('menu');
                  resetGame();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 md:px-8 rounded-lg transition-colors"
              >
                Change Mode
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DotsAndBoxes;