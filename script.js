document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // DOM Elements
    // =====================
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');
    const gameContainer = document.getElementById('game-container');
    const modeSelectionScreen = document.getElementById('mode-selection-screen');
    const nameInputScreen = document.getElementById('name-input-screen');
    const gameScreen = document.getElementById('game-screen');
    const scoreboardScreen = document.getElementById('scoreboard-screen');
    const achievementsScreen = document.getElementById('achievements-screen');
    const dailyChallengeScreen = document.getElementById('daily-challenge-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    // Input elements
    const playerNameInput = document.getElementById('player-name');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const startGameBtn = document.getElementById('start-game-btn');
    const difficultySelect = document.getElementById('difficulty');
    const numberStyleSelect = document.getElementById('number-style');
    
    // Game elements
    const currentPlayerSpan = document.getElementById('current-player');
    const currentLevelSpan = document.getElementById('current-level');
    const currentScoreSpan = document.getElementById('current-score');
    const player2ScoreSpan = document.getElementById('player2-score');
    const player2Info = document.getElementById('player2-info');
    const numberDisplay = document.getElementById('number-display');
    const userInput = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const aiSubmitBtn = document.getElementById('ai-submit-btn');
    const feedback = document.getElementById('feedback');
    const timeAttackTimer = document.getElementById('time-attack-timer');
    const timerDisplay = document.getElementById('timer');
    
    // Powerups
    const peekBtn = document.getElementById('peek-btn');
    const slowmoBtn = document.getElementById('slowmo-btn');
    const doubleBtn = document.getElementById('double-btn');
    
    // AI elements
    const aiThinking = document.getElementById('ai-thinking');
    const aiProgress = document.querySelector('.ai-progress');
    
    // Navigation buttons
    const classicModeBtn = document.getElementById('classic-mode-btn');
    const timeAttackBtn = document.getElementById('time-attack-btn');
    const multiplayerBtn = document.getElementById('multiplayer-btn');
    const dailyChallengeBtn = document.getElementById('daily-challenge-btn');
    const aiChallengeBtn = document.getElementById('ai-challenge-btn');
    const scoreboardBtn = document.getElementById('scoreboard-btn');
    const achievementsBtn = document.getElementById('achievements-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const backToMenuBtn2 = document.getElementById('back-to-menu-btn-2');
    const backToMenuBtn3 = document.getElementById('back-to-menu-btn-3');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    
    // Results screen
    const resultsTitle = document.getElementById('results-title');
    const resultsContent = document.getElementById('results-content');
    const playAgainBtn = document.getElementById('play-again-btn');
    const shareBtn = document.getElementById('share-btn');
    const menuBtn = document.getElementById('menu-btn');
    
    // Audio elements
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const bgMusic = document.getElementById('bg-music');
    const levelUpSound = document.getElementById('level-up-sound');
    const powerupSound = document.getElementById('powerup-sound');
    const countdownSound = document.getElementById('countdown-sound');
    const soundBtn = document.getElementById('sound-btn');
    
    // Social share
    const twitterShareBtn = document.getElementById('twitter-share');
    const facebookShareBtn = document.getElementById('facebook-share');
    const qrBtn = document.getElementById('qr-btn');
    const qrModal = document.getElementById('qr-modal');
    const qrCodeElement = document.getElementById('qr-code');
    const closeModal = document.querySelector('.close');
    
    // Confetti canvas
    const confettiCanvas = document.getElementById('confetti-canvas');
    
    // =====================
    // Game Variables
    // =====================
    let gameState = {
        mode: 'classic', // 'classic', 'timeattack', 'multiplayer', 'daily', 'ai'
        difficulty: 1000, // ms to display number
        numberStyle: 'decimal', // 'decimal', 'binary', 'hex', 'matrix'
        players: [
            { name: '', score: 0, powerups: { peek: 3, slowmo: 1, double: 1 } },
            { name: '', score: 0, powerups: { peek: 3, slowmo: 1, double: 1 } }
        ],
        currentPlayerIndex: 0,
        currentNumber: '',
        currentLevel: 1,
        gameStartTime: 0,
        gameActive: false,
        displayTimeout: null,
        timeLeft: 60,
        timerInterval: null,
        aiInterval: null,
        isPeeking: false,
        isDoublePoints: false,
        isSlowMo: false,
        dailyChallenge: null,
        achievements: {
            firstGame: { name: "First Game", desc: "Complete your first game", unlocked: false, icon: "🎮" },
            perfect10: { name: "Perfect 10", desc: "Reach 10 digits without mistakes", unlocked: false, icon: "🔟" },
            speedster: { name: "Speedster", desc: "Solve 5 numbers in under 10 seconds", unlocked: false, icon: "⚡" },
            powerUser: { name: "Power User", desc: "Use all powerups in one game", unlocked: false, icon: "💎" },
            dailyPlayer: { name: "Daily Player", desc: "Complete 5 daily challenges", unlocked: false, icon: "📅" },
            aiMaster: { name: "AI Master", desc: "Beat the AI 3 times", unlocked: false, icon: "🤖" },
            memoryMaster: { name: "Memory Master", desc: "Reach 20 digits", unlocked: false, icon: "🧠" },
            sharer: { name: "Sharer", desc: "Share your score", unlocked: false, icon: "📤" }
        },
        stats: {
            gamesPlayed: 0,
            digitsMemorized: 0,
            powerupsUsed: 0,
            dailyChallengesCompleted: 0,
            aiBattlesWon: 0
        }
    };

    // =====================
    // Initialization
    // =====================
    // Initialize splash screen sequence
    setTimeout(() => {
        splashText.textContent = "Loading.....";
    }, 500);

    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            loadGame();
        }, 500);
    }, 1000);

    // Initialize local storage
    function loadGame() {
        // Load scores
        if (!localStorage.getItem('memoryGameScores')) {
            localStorage.setItem('memoryGameScores', JSON.stringify({
                classic: [],
                timeattack: [],
                daily: []
            }));
        }

        // Load stats
        if (localStorage.getItem('memoryGameStats')) {
            gameState.stats = JSON.parse(localStorage.getItem('memoryGameStats'));
        }

        // Load achievements
        if (localStorage.getItem('memoryGameAchievements')) {
            const savedAchievements = JSON.parse(localStorage.getItem('memoryGameAchievements'));
            for (const key in savedAchievements) {
                if (gameState.achievements[key]) {
                    gameState.achievements[key].unlocked = savedAchievements[key];
                }
            }
        }

        // Set up daily challenge
        setupDailyChallenge();

        // Start background music
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
    }

    // =====================
    // Event Listeners
    // =====================
    // Mode selection
    classicModeBtn.addEventListener('click', () => {
        gameState.mode = 'classic';
        showNameInputScreen();
    });

    timeAttackBtn.addEventListener('click', () => {
        gameState.mode = 'timeattack';
        showNameInputScreen();
    });

    multiplayerBtn.addEventListener('click', () => {
        gameState.mode = 'multiplayer';
        showNameInputScreen(true);
    });

    dailyChallengeBtn.addEventListener('click', () => {
        gameState.mode = 'daily';
        dailyChallengeScreen.classList.remove('hidden');
        modeSelectionScreen.classList.add('hidden');
    });

    aiChallengeBtn.addEventListener('click', () => {
        gameState.mode = 'ai';
        showNameInputScreen();
    });

    startChallengeBtn.addEventListener('click', () => {
        dailyChallengeScreen.classList.add('hidden');
        showNameInputScreen();
    });

    backToMenuBtn3.addEventListener('click', () => {
        dailyChallengeScreen.classList.add('hidden');
        modeSelectionScreen.classList.remove('hidden');
    });

    // Name input
    startGameBtn.addEventListener('click', startGame);

    // Game controls
    submitBtn.addEventListener('click', checkAnswer);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    aiSubmitBtn.addEventListener('click', () => {
        if (gameState.gameActive) {
            userInput.value = gameState.currentNumber;
            checkAnswer();
        }
    });

    // Powerups
    peekBtn.addEventListener('click', usePeekPowerup);
    slowmoBtn.addEventListener('click', useSlowmoPowerup);
    doubleBtn.addEventListener('click', useDoublePowerup);

    // Navigation
    scoreboardBtn.addEventListener('click', showScoreboard);
    achievementsBtn.addEventListener('click', showAchievements);
    backToMenuBtn.addEventListener('click', returnToMenu);
    backToMenuBtn2.addEventListener('click', returnToMenu);
    playAgainBtn.addEventListener('click', playAgain);
    menuBtn.addEventListener('click', returnToMenu);

    // Sound control
    soundBtn.addEventListener('click', toggleSound);

    // Social sharing
    twitterShareBtn.addEventListener('click', shareOnTwitter);
    facebookShareBtn.addEventListener('click', shareOnFacebook);
    qrBtn.addEventListener('click', showQRCode);
    closeModal.addEventListener('click', () => qrModal.classList.add('hidden'));

    // Window click for modal
    window.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.add('hidden');
        }
    });

    // Difficulty and style changes
    difficultySelect.addEventListener('change', (e) => {
        gameState.difficulty = parseInt(e.target.value);
    });

    numberStyleSelect.addEventListener('change', (e) => {
        gameState.numberStyle = e.target.value;
        if (gameState.numberStyle === 'matrix') {
            startMatrixRain();
        } else {
            stopMatrixRain();
        }
    });

    // =====================
    // Game Functions
    // =====================
    function showNameInputScreen(multiplayer = false) {
        modeSelectionScreen.classList.add('hidden');
        nameInputScreen.classList.remove('hidden');
        
        if (multiplayer) {
            document.getElementById('single-player-input').classList.add('hidden');
            document.getElementById('multiplayer-input').classList.remove('hidden');
        } else {
            document.getElementById('single-player-input').classList.remove('hidden');
            document.getElementById('multiplayer-input').classList.add('hidden');
        }
    }

    function startGame() {
        // Set player names
        if (gameState.mode === 'multiplayer') {
            gameState.players[0].name = player1NameInput.value.trim() || "Player 1";
            gameState.players[1].name = player2NameInput.value.trim() || "Player 2";
            player2Info.classList.remove('hidden');
        } else {
            gameState.players[0].name = playerNameInput.value.trim() || "Player";
            player2Info.classList.add('hidden');
        }

        if (!gameState.players[0].name) {
            alert('Please enter your name');
            return;
        }

        // Reset game state
        gameState.currentPlayerIndex = 0;
        gameState.currentLevel = 1;
        gameState.players[0].score = 0;
        gameState.players[1].score = 0;
        gameState.players[0].powerups = { peek: 3, slowmo: 1, double: 1 };
        gameState.players[1].powerups = { peek: 3, slowmo: 1, double: 1 };
        gameState.isDoublePoints = false;
        gameState.isSlowMo = false;
        
        // Update UI
        currentPlayerSpan.textContent = gameState.players[0].name;
        currentLevelSpan.textContent = gameState.currentLevel;
        currentScoreSpan.textContent = gameState.players[0].score;
        player2ScoreSpan.textContent = gameState.players[1].score;
        
        // Show game screen
        nameInputScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Start the game
        gameState.gameActive = true;
        gameState.gameStartTime = Date.now();
        
        // Special modes
        if (gameState.mode === 'timeattack') {
            timeAttackTimer.classList.remove('hidden');
            gameState.timeLeft = 60;
            timerDisplay.textContent = gameState.timeLeft;
            gameState.timerInterval = setInterval(updateTimer, 1000);
        } else {
            timeAttackTimer.classList.add('hidden');
        }
        
        if (gameState.mode === 'ai') {
            aiSubmitBtn.classList.remove('hidden');
        } else {
            aiSubmitBtn.classList.add('hidden');
        }
        
        // Start first round
        startRound();
    }

    function startRound() {
        // Generate number based on current level
        gameState.currentNumber = generateNumber(gameState.currentLevel);
        
        // Apply number style
        displayNumber(gameState.currentNumber);
        
        // Reset input
        userInput.value = '';
        userInput.disabled = true;
        submitBtn.disabled = true;
        feedback.textContent = '';
        
        // Hide number after delay
        let displayTime = gameState.isSlowMo ? gameState.difficulty * 1.5 : gameState.difficulty;
        
        if (gameState.displayTimeout) clearTimeout(gameState.displayTimeout);
        gameState.displayTimeout = setTimeout(() => {
            numberDisplay.textContent = '';
            userInput.disabled = false;
            submitBtn.disabled = false;
            userInput.focus();
            
            // Start AI thinking if in AI mode
            if (gameState.mode === 'ai' && gameState.currentPlayerIndex === 1) {
                startAIThinking();
            }
        }, displayTime);
    }

    function generateNumber(digits) {
        let number = '';
        for (let i = 0; i < digits; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    }

    function displayNumber(number) {
        switch (gameState.numberStyle) {
            case 'binary':
                numberDisplay.textContent = parseInt(number).toString(2).padStart(number.length * 4, '0');
                numberDisplay.classList.add('binary-digit');
                numberDisplay.classList.remove('hex-digit', 'matrix-style');
                break;
            case 'hex':
                numberDisplay.textContent = parseInt(number).toString(16).toUpperCase();
                numberDisplay.classList.add('hex-digit');
                numberDisplay.classList.remove('binary-digit', 'matrix-style');
                break;
            case 'matrix':
                numberDisplay.textContent = number.split('').map(d => Math.random() > 0.3 ? d : String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
                numberDisplay.classList.add('matrix-style');
                numberDisplay.classList.remove('binary-digit', 'hex-digit');
                break;
            default: // decimal
                numberDisplay.textContent = number;
                numberDisplay.classList.remove('binary-digit', 'hex-digit', 'matrix-style');
        }
        
        // Add animation
        numberDisplay.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            numberDisplay.classList.remove('animate__animated', 'animate__fadeIn');
        }, 500);
    }

    function checkAnswer() {
        if (!gameState.gameActive) return;

        const userAnswer = userInput.value.trim();
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        if (userAnswer === gameState.currentNumber) {
            // Correct answer
            handleCorrectAnswer(currentPlayer);
        } else {
            // Wrong answer
            handleWrongAnswer(currentPlayer);
        }
    }

    function handleCorrectAnswer(player) {
        // Play correct sound
        correctSound.currentTime = 0;
        correctSound.play();
        
        // Calculate points (double if powerup active)
        let points = gameState.isDoublePoints ? gameState.currentLevel * 2 : gameState.currentLevel;
        player.score += points;
        
        // Update UI
        feedback.textContent = 'Correct! +' + points;
        feedback.className = 'correct-feedback animate__animated animate__bounce';
        currentScoreSpan.textContent = gameState.players[0].score;
        player2ScoreSpan.textContent = gameState.players[1].score;
        
        // Check for achievements
        checkForAchievements();
        
        // Level up
        gameState.currentLevel++;
        currentLevelSpan.textContent = gameState.currentLevel;
        
        // Play level up sound every 5 levels
        if (gameState.currentLevel % 5 === 0) {
            levelUpSound.currentTime = 0;
            levelUpSound.play();
            
            // Add celebration