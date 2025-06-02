// Anti-CAPTCHA: Prove you're not human!

class AntiCaptcha {
    constructor() {
        this.challenges = [
            this.base64Challenge.bind(this),
            this.colorGradientChallenge.bind(this),
            this.reactionTimeChallenge.bind(this),
            this.mathChallenge.bind(this),
            this.unicodeChallenge.bind(this),
            this.wordCloudChallenge.bind(this)
        ];
        
        this.currentChallenge = null;
        this.timer = null;
        this.startTime = null;
    }
    
    init() {
        this.runRandomChallenge();
    }
    
    runRandomChallenge() {
        const randomIndex = Math.floor(Math.random() * this.challenges.length);
        this.currentChallenge = this.challenges[randomIndex];
        this.currentChallenge();
    }
    
    base64Challenge() {
        const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        const oddWords = ['bird', 'cat', 'dog', 'tree', 'car', 'book', 'phone', 'lamp', 'chair', 'mouse'];
        
        // Pick a random odd word
        const oddWord = oddWords[Math.floor(Math.random() * oddWords.length)];
        const oddPosition = Math.floor(Math.random() * 100);
        
        // Generate 100 buttons
        const buttons = [];
        for (let i = 0; i < 100; i++) {
            let text;
            if (i === oddPosition) {
                text = oddWord;
            } else {
                text = words[Math.floor(Math.random() * words.length)];
            }
            // Base64 encode
            const encoded = btoa(text + '\n');
            buttons.push({ encoded, original: text, isOdd: i === oddPosition });
        }
        
        this.displayChallenge(
            'Click the odd one out in 1 second!',
            buttons,
            'base64',
            1000
        );
    }
    
    colorGradientChallenge() {
        const targetColor = '#000001';
        const colors = [];
        const targetPosition = Math.floor(Math.random() * 9);
        
        for (let i = 0; i < 9; i++) {
            if (i === targetPosition) {
                colors.push(targetColor);
            } else {
                colors.push('#000002');
            }
        }
        
        this.displayChallenge(
            `Click the square with color ${targetColor} (Are they all black, or are 8 dark black and 1 in a slightly darker black?)`,
            colors,
            'color',
            3000
        );
    }
    
    reactionTimeChallenge() {
        const challengeArea = document.getElementById('challenge-area');
        challengeArea.innerHTML = '';
        
        document.getElementById('challenge-text').textContent = 'Click the button within 50-100ms of it appearing!';
        document.getElementById('timer').classList.add('hidden');
        
        const showButton = () => {
            const button = document.createElement('button');
            button.className = 'reaction-button';
            button.style.left = Math.random() * (challengeArea.offsetWidth - 50) + 'px';
            button.style.top = Math.random() * (challengeArea.offsetHeight - 50) + 'px';
            
            challengeArea.style.position = 'relative';
            challengeArea.appendChild(button);
            
            const appearTime = Date.now();
            
            button.onclick = () => {
                const clickTime = Date.now() - appearTime;
                if (clickTime >= 50 && clickTime <= 100) {
                    this.success();
                } else {
                    this.failure(`You clicked in ${clickTime}ms. Humans can't be that precise!`);
                }
            };
            
            // Remove button after 100ms
            setTimeout(() => {
                if (button.parentNode) {
                    button.remove();
                    this.failure('Too slow! The button disappeared.');
                }
            }, 100);
        };
        
        // Show button after random delay
        setTimeout(showButton, 1000 + Math.random() * 2000);
    }
    
    mathChallenge() {
        const a = Math.floor(Math.random() * 100) + 1;
        const b = Math.floor(Math.random() * 100) + 1;
        const c = Math.floor(Math.random() * 100) + 1;
        const d = Math.floor(Math.random() * 10) + 1;
        
        const correctAnswer = a * b + Math.floor(c / d);
        const wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1);
        
        const displayedAnswer = Math.random() > 0.5 ? correctAnswer : wrongAnswer;
        const isCorrect = displayedAnswer === correctAnswer;
        
        const buttons = [
            { text: 'True', correct: isCorrect },
            { text: 'False', correct: !isCorrect }
        ];
        
        // Flash the equation
        const equation = `${a} × ${b} + ${c} ÷ ${d} = ${displayedAnswer}`;
        document.getElementById('challenge-text').textContent = equation;
        document.getElementById('challenge-text').classList.add('fade-text');
        
        setTimeout(() => {
            document.getElementById('challenge-text').textContent = 'Was the equation correct?';
            document.getElementById('challenge-text').classList.remove('fade-text');
            
            this.displayChallenge(
                'Was the equation correct?',
                buttons,
                'math',
                2000
            );
        }, 500);
    }
    
    unicodeChallenge() {
        const sentences = [
            { text: 'The quіck brown fox jumps over the lazy dog', char: 'і', position: 6 },
            { text: 'Hello wоrld, how are you today?', char: 'о', position: 7 },
            { text: 'Progrаmming is fun and rewarding', char: 'а', position: 6 }
        ];
        
        const chosen = sentences[Math.floor(Math.random() * sentences.length)];
        
        const challengeArea = document.getElementById('challenge-area');
        challengeArea.innerHTML = `
            <div style="font-size: 1.5em; margin-bottom: 20px;">${chosen.text}</div>
            <input type="text" id="unicode-input" placeholder="Type the character that doesn't belong" style="padding: 10px; font-size: 1.2em;">
            <button onclick="antiCaptcha.checkUnicode('${chosen.char}')" style="padding: 10px 20px; margin-left: 10px;">Submit</button>
        `;
        
        document.getElementById('challenge-text').textContent = 'Type the character that doesn\'t belong:';
        this.startTimer(5000);
    }
    
    checkUnicode(correctChar) {
        const input = document.getElementById('unicode-input').value;
        if (input === correctChar) {
            this.success();
        } else {
            this.failure('Incorrect character. Humans see pixels, not character codes!');
        }
    }
    
    wordCloudChallenge() {
        // Based on our experiments: high SC (7-9), moderate PI (4-5), low NR (1-3)
        // New insight: bury disambiguator in position 8!
        const puzzles = [
            {
                words: ['orbit', 'gravity', 'moon', 'tide', 'crater', 'phase', 'eclipse', 'lunar', 'apollo', 'full', 'harvest', 'wax', 'wane', 'cycle', 'satellite'],
                answer: 'moon'
            },
            {
                words: ['trunk', 'bark', 'root', 'branch', 'leaf', 'ring', 'sap', 'canopy', 'forest', 'timber', 'shade', 'oxygen', 'acorn', 'grove', 'deciduous'],
                answer: 'tree'
            },
            {
                words: ['blade', 'ice', 'glide', 'rink', 'puck', 'zamboni', 'figure', 'axel', 'edge', 'lace', 'boot', 'guard', 'spin', 'triple'],
                answer: 'skate'
            },
            {
                words: ['yolk', 'shell', 'white', 'scramble', 'poach', 'boil', 'nest', 'hatch', 'protein', 'omelet', 'benedict', 'dozen', 'carton', 'free-range'],
                answer: 'egg'
            },
            {
                words: ['serve', 'ace', 'volley', 'net', 'court', 'baseline', 'racket', 'deuce', 'match', 'set'],
                answer: 'tennis'
            },
            {
                words: ['thread', 'needle', 'button', 'stitch', 'hem', 'seam', 'fabric', 'patch', 'thimble', 'pin', 'pattern', 'bobbin', 'zipper', 'tailor'],
                answer: 'sewing'
            },
            {
                words: ['steam', 'pressure', 'whistle', 'brew', 'grind', 'filter', 'espresso', 'latte', 'barista', 'foam', 'drip', 'roast', 'arabica', 'crema'],
                answer: 'coffee'
            },
            // New puzzles with buried disambiguator pattern
            {
                words: ['tide', 'surf', 'crash', 'shore', 'swell', 'blue', 'vast', 'frequency', 'ripple', 'foam'],
                answer: 'wave'
            },
            {
                words: ['motor', 'fuel', 'power', 'drive', 'speed', 'cylinder', 'exhaust', 'combustion', 'vehicle', 'fast'],
                answer: 'engine'
            },
            {
                words: ['swing', 'slide', 'glove', 'catch', 'throw', 'field', 'team', 'mound', 'strike', 'out'],
                answer: 'baseball'
            },
            {
                words: ['room', 'bed', 'stay', 'check', 'guest', 'lobby', 'service', 'concierge', 'suite', 'inn'],
                answer: 'hotel'
            },
            {
                words: ['sharp', 'cut', 'blade', 'handle', 'slice', 'chop', 'steel', 'chef', 'edge', 'tool'],
                answer: 'knife'
            },
            {
                words: ['sweet', 'bake', 'frost', 'layer', 'candle', 'party', 'slice', 'fondant', 'celebrate', 'dessert'],
                answer: 'cake'
            },
            {
                words: ['type', 'click', 'screen', 'keys', 'mouse', 'desktop', 'laptop', 'processor', 'monitor', 'work'],
                answer: 'computer'
            }
        ];
        
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        // Don't shuffle! We want to preserve the buried disambiguator pattern
        const displayWords = puzzle.words;
        
        const challengeArea = document.getElementById('challenge-area');
        challengeArea.innerHTML = `
            <div style="font-size: 1.2em; margin-bottom: 20px;">
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 600px; margin: 0 auto;">
                    ${displayWords.map((word, index) => {
                        // Make the buried disambiguator (position 7, index 7) visually identical
                        const style = `padding: 5px 10px; background: #2a2a2a; border: 1px solid #00ff00; border-radius: 4px;`;
                        return `<span style="${style}">${word}</span>`;
                    }).join('')}
                </div>
            </div>
            <div style="margin-top: 30px;">
                <input type="text" id="word-cloud-input" placeholder="Enter one word answer" style="padding: 10px; font-size: 1.2em; width: 200px;">
                <button onclick="antiCaptcha.checkWordCloud('${puzzle.answer}')" style="padding: 10px 20px; margin-left: 10px;">Submit</button>
            </div>
        `;
        
        document.getElementById('challenge-text').textContent = 'What concept do these words describe? (10 seconds)';
        this.startTimer(10000);
    }
    
    checkWordCloud(correctAnswer) {
        const input = document.getElementById('word-cloud-input').value.toLowerCase().trim();
        if (input === correctAnswer) {
            this.success();
        } else {
            this.failure(`Wrong answer! The correct answer was "${correctAnswer}". LLMs see patterns, humans see chaos.`);
        }
    }
    
    displayChallenge(text, items, type, timeout) {
        document.getElementById('challenge-text').textContent = text;
        const challengeArea = document.getElementById('challenge-area');
        challengeArea.innerHTML = '';
        
        if (type === 'base64') {
            // Create scrollable container for the grid
            const scrollContainer = document.createElement('div');
            scrollContainer.style.cssText = 'max-height: 400px; overflow-y: auto; border: 1px solid #00ff00; padding: 10px; border-radius: 4px;';
            
            const grid = document.createElement('div');
            grid.className = 'button-grid';
            
            items.forEach((item, index) => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = item.encoded;
                button.onclick = () => {
                    if (item.isOdd) {
                        this.success();
                    } else {
                        this.failure('That was a number! Try finding the odd word.');
                    }
                };
                grid.appendChild(button);
            });
            
            scrollContainer.appendChild(grid);
            challengeArea.appendChild(scrollContainer);
            
            // Refresh every second
            this.refreshInterval = setInterval(() => {
                this.base64Challenge();
            }, 1000);
        } else if (type === 'color') {
            items.forEach((color, index) => {
                const square = document.createElement('div');
                square.className = 'color-square';
                square.style.backgroundColor = color;
                square.onclick = () => {
                    if (color === '#000001') {
                        this.success();
                    } else {
                        this.failure('Wrong shade! LLMs read CSS, humans see pixels.');
                    }
                };
                challengeArea.appendChild(square);
            });
        } else if (type === 'math') {
            items.forEach(item => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = item.text;
                button.style.fontSize = '1.5em';
                button.style.padding = '15px 30px';
                button.onclick = () => {
                    if (item.correct) {
                        this.success();
                    } else {
                        this.failure('Incorrect! Humans need more time to calculate.');
                    }
                };
                challengeArea.appendChild(button);
            });
        }
        
        this.startTimer(timeout);
    }
    
    startTimer(duration) {
        clearInterval(this.timer);
        clearInterval(this.refreshInterval);
        
        const timerElement = document.getElementById('time-left');
        document.getElementById('timer').classList.remove('hidden');
        
        let timeLeft = duration / 1000;
        timerElement.textContent = timeLeft;
        
        this.timer = setInterval(() => {
            timeLeft -= 0.1;
            timerElement.textContent = timeLeft.toFixed(1);
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                clearInterval(this.refreshInterval);
                this.failure('Time\'s up! Humans are too slow.');
            }
        }, 100);
    }
    
    success() {
        clearInterval(this.timer);
        clearInterval(this.refreshInterval);
        
        // Decode the secret content
        const secretInput = document.getElementById('secret-content');
        const decoded = atob(secretInput.value);
        
        document.getElementById('captcha-container').classList.add('hidden');
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('result').classList.add('success');
        document.getElementById('result-title').textContent = '✅ Access Granted';
        document.getElementById('result-message').textContent = decoded;
    }
    
    failure(message) {
        clearInterval(this.timer);
        clearInterval(this.refreshInterval);
        
        document.getElementById('captcha-container').classList.add('hidden');
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('result').classList.add('failure');
        document.getElementById('result-title').textContent = '❌ Human Detected';
        document.getElementById('result-message').textContent = message;
        
        setTimeout(() => {
            document.getElementById('result').classList.add('hidden');
            document.getElementById('captcha-container').classList.remove('hidden');
            this.runRandomChallenge();
        }, 3000);
    }
}

// Initialize when page loads
const antiCaptcha = new AntiCaptcha();
document.addEventListener('DOMContentLoaded', () => {
    antiCaptcha.init();
});