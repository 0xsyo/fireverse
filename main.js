const axios = require('axios');
const fs = require('fs').promises;
const chalk = require('chalk');
const fakeUa = require('fake-useragent');
require('dotenv').config();

const ASCII_ART = `
  _______                          
 |     __|.--.--.---.-.-----.---.-.
 |__     ||  |  |  _  |-- __|  _  |
 |_______||___  |___._|_____|___._|
          |_____|
`;

const SEPARATOR = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

function rainbowBanner() {
  const colors = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.blue, chalk.magenta];
  console.clear();
  for (let i = 0; i < ASCII_ART.length; i++) {
    process.stdout.write(colors[i % colors.length](ASCII_ART[i]));
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 7);
  }
  console.log(chalk.yellow("\n"));
}

rainbowBanner();

function getRandomTheme() {
  const themes = [
    "Music Production Techniques",
    "Influence of Music Genres",
    "Impact of Lyrics on Listeners",
    "Evolution of Music Technology",
    "Cultural Significance of Music",
    "Role of Music in Media",
    "Music Theory and Composition",
    "Psychological Effects of Music",
    "Music and Social Movements",
    "Future of Music Industry"
  ];
  return themes[Math.floor(Math.random() * themes.length)];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateRandomWords() {
  const words = {
    subjects: [
      "music", "songs", "melodies", "rhythms", "lyrics", "compositions", "genres", "harmonies", "beats", "albums"
    ],
    verbs: [
      "influence", "affect", "enhance", "transform", "elevate", "inspire", "shape", "define", "capture", "reflect"
    ],
    objects: [
      "emotions", "moods", "cultures", "trends", "listeners", "artists", "performances", "experiences", "audiences", "creativity"
    ],
    questions: [
      "How", "What", "Can", "Why", "Does", "What impact does", "How does", "What effect does", "Can", "How can"
    ],
    modifiers: [
      "the perception of", "the evolution of", "the understanding of", "the popularity of", "the influence of", "the role of", "the significance of"
    ]
  };

  const subject = words.subjects[Math.floor(Math.random() * words.subjects.length)];
  const verb = words.verbs[Math.floor(Math.random() * words.verbs.length)];
  const object = words.objects[Math.floor(Math.random() * words.objects.length)];
  const question = words.questions[Math.floor(Math.random() * words.questions.length)];
  const modifier = words.modifiers[Math.floor(Math.random() * words.modifiers.length)];

  return {
    subject,
    verb,
    object,
    question,
    modifier
  };
}

function generateHardcodedComment(songTitle) {
  const { subject, verb, object, question, modifier } = generateRandomWords();
  const comments = [
    `I love how ${subject} ${verb} ${modifier} ${object} in ${songTitle}.`,
    `The ${subject} in ${songTitle} really ${verb} my ${object}.`,
    `${songTitle} has such a ${modifier} ${subject} that ${verb} ${object}.`,
    `Listening to ${songTitle} makes me feel ${object}.`,
    `Can ${subject} in ${songTitle} ${verb} ${modifier} ${object}?`,
    `How does ${songTitle} ${verb} ${modifier} ${object}?`
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

async function generateRandomComment(songTitle) {
  try {
    const theme = getRandomTheme();
    const response = await axios.post('https://api.groq.cloud/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'user', 
          content: `Generate a positive, constructive, or emotional comment related to the song '${songTitle}' in the context of ${theme}.`
        }
      ],
      temperature: 0.9
    });
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      return generateHardcodedComment(songTitle);
    }
  } catch (error) {
    return generateHardcodedComment(songTitle);
  }
}

function getRandomPosition() {
  const positions = ["start", "middle", "end"];
  return positions[Math.floor(Math.random() * positions.length)];
}

function getRandomPrefix() {
  const prefixes = ["Regarding", "About", "Concerning", "In reference to", "On the topic of"];
  return prefixes[Math.floor(Math.random() * prefixes.length)];
}

class MusicBot {
    constructor(token, accountIndex) {
        this.baseUrl = 'https://api.fireverseai.com';
        this.token = token;
        this.accountIndex = accountIndex;
        this.playedSongs = new Set();
        this.dailyPlayCount = 0;
        this.DAILY_LIMIT = 50;
        this.lastHeartbeat = Date.now();
        this.totalListeningTime = 0;
        this.headers = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.8',
            'content-type': 'application/json',
            'origin': 'https://app.fireverseai.com',
            'referer': 'https://app.fireverseai.com/',
            'user-agent': fakeUa(),
            'x-version': '1.0.100',
            'token': token
        };
        this.logColors = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.blue, chalk.magenta];
        this.logIndex = 0;
    }

    log(message, overwrite = false) {
        const color = this.logColors[this.logIndex % this.logColors.length];
        this.logIndex++;
        const prefix = `[Account ${this.accountIndex}] `;
        if (overwrite) {
            process.stdout.write(`\r${color(prefix + message)}`);
        } else {
            console.log(color(prefix + message));
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    async initialize() {
        try {
            await this.getUserInfo();
            await this.getDailyTasks();
            this.log(SEPARATOR);
            return true;
        } catch (error) {
            this.log('Error initializing bot: ' + error.message);
            return false;
        }
    }

    async getUserInfo() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/userInfo/getMyInfo`,
                { headers: this.headers }
            );
            const { level, expValue, score, nextLevelExpValue } = response.data.data;
            this.log('User Stats:');
            this.log(`Level: ${level} | EXP: ${expValue}/${nextLevelExpValue} | Score: ${score}`);
            this.log(`Total Listening Time: ${Math.floor(this.totalListeningTime / 60)} minutes`);
        } catch (error) {
            this.log('Error getting user info: ' + error.message);
        }
    }

    async getDailyTasks() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/musicTask/getListByCategory?taskCategory=1`,
                { headers: this.headers }
            );
            
            if (response.data?.data && Array.isArray(response.data.data)) {
                this.log('Daily Tasks:');
                response.data.data.forEach(task => {
                    if (task && task.name) {
                        let progress;
                        if (task.taskKey === 'play_music' && task.unit === 'minutes') {
                            progress = `${Math.floor(this.totalListeningTime / 60)}/${task.completeNum}`;
                        } else {
                            progress = task.itemCount || `${task.completedRounds || 0}/${task.maxCompleteLimit || task.completeNum || 0}`;
                        }
                        this.log(`- ${task.name}: ${progress} (${task.rewardScore} points)`);
                    }
                });
            }
        } catch (error) {
            this.log('Error getting daily tasks: ' + error.message);
        }
    }

    async getRecommendedSongs() {
        try {
            const response = await axios.post(
                `${this.baseUrl}/home/getRecommend`,
                { type: 1 },
                { headers: this.headers }
            );
            return shuffleArray(response.data?.data || []);
        } catch (error) {
            this.log('Error getting recommended songs: ' + error.message);
            return [];
        }
    }

    async addToHistory(musicId) {
        try {
            await axios.post(
                `${this.baseUrl}/musicHistory/addToHistory/${musicId}`,
                {},
                { headers: this.headers }
            );
        } catch (error) {
            this.log('Error adding to history: ' + error.message);
        }
    }

    async getMusicDetails(musicId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/music/getDetailById?musicId=${musicId}`,
                { headers: this.headers }
            );
            return response.data?.data;
        } catch (error) {
            this.log('Error getting music details: ' + error.message);
            return null;
        }
    }

    async sendHeartbeat() {
        try {
            const now = Date.now();
            if (now - this.lastHeartbeat >= 30000) {
                await axios.post(
                    `${this.baseUrl}/music/userOnlineTime/receiveHeartbeat`,
                    {},
                    { headers: this.headers }
                );
                this.lastHeartbeat = now;
                process.stdout.write('.');
            }
        } catch (error) {
            // Silent heartbeat errors
        }
    }

    async generateComment(songTitle) {
        try {
            const comment = await generateRandomComment(songTitle);
            const position = getRandomPosition();
            const prefix = getRandomPrefix();
            let finalComment;

            if (position === "start") {
                finalComment = `${prefix} ${songTitle} ${comment}`;
            } else if (position === "middle") {
                finalComment = `${comment} ${prefix} ${songTitle}`;
            } else {
                finalComment = `${comment} - ${prefix} ${songTitle}`;
            }

            return finalComment;
        } catch (error) {
            this.log('Error generating comment: ' + error.message);
            return `I really like the song ${songTitle} - good one!`;
        }
    }

    async commentMusic(musicId, songTitle) {
        try {
            const commentContent = await this.generateComment(songTitle);
            const commentData = {
                content: commentContent,
                musicId,
                parentId: 0,
                rootId: 0
            };
            
            const response = await axios.post(
                `${this.baseUrl}/musicComment/addComment`,
                commentData,
                { headers: this.headers }
            );
            this.log(`Generated Comment: ${commentContent}`);
            return response.data?.success || false;
        } catch (error) {
            this.log('Error commenting on music: ' + error.message);
            return false;
        }
    }

    async playMusic(musicId) {
        try {
            await axios.post(
                `${this.baseUrl}/musicUserBehavior/playEvent`,
                { musicId, event: 'playing' },
                { headers: this.headers }
            );
            return true;
        } catch (error) {
            this.log('Error playing music: ' + error.message);
            return false;
        }
    }

    async endMusic(musicId) {
        try {
            await axios.post(
                `${this.baseUrl}/musicUserBehavior/playEvent`,
                { musicId, event: 'playEnd' },
                { headers: this.headers }
            );
            return true;
        } catch (error) {
            this.log('Error ending music: ' + error.message);
            return false;
        }
    }

    async likeMusic(musicId) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/musicMyFavorite/addToMyFavorite?musicId=${musicId}`,
                {},
                { headers: this.headers }
            );
            return response.data?.success || false;
        } catch (error) {
            this.log('Error liking music: ' + error.message);
            return false;
        }
    }

    async playSession() {
        try {
            if (this.dailyPlayCount >= this.DAILY_LIMIT) {
                this.log(`Daily limit reached (${this.DAILY_LIMIT}/${this.DAILY_LIMIT}). Waiting for reset...`);
                return false;
            }

            const songs = await this.getRecommendedSongs();
            if (!songs || songs.length === 0) {
                this.log('No songs available, retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                return true;
            }

            for (const song of songs) {
                if (this.playedSongs.has(song.id)) continue;

                this.playedSongs.add(song.id);
                this.dailyPlayCount++;

                const musicDetails = await this.getMusicDetails(song.id) || {};
                const duration = musicDetails.duration || song.duration || 180;
                
                await this.addToHistory(song.id);

                const songName = song.musicName || musicDetails.musicName || 'Unknown Song';
                const author = song.author || musicDetails.author || 'Unknown Artist';

                this.log('Now Playing:');
                this.log(`Title: ${songName}`);
                this.log(`Artist: ${author}`);
                this.log(`Music ID: ${song.id}`);
                this.log(`Progress: ${this.dailyPlayCount}/${this.DAILY_LIMIT} songs today`);
                this.log(`Duration: ${this.formatTime(duration)}`);

                const likeSuccess = await this.likeMusic(song.id);
                this.log(`Like status: ${likeSuccess ? 'Success' : 'Failed'}`);
                
                const commentSuccess = await this.commentMusic(song.id, songName);
                this.log(`Comment status: ${commentSuccess ? 'Success' : 'Failed'}`);

                if (await this.playMusic(song.id)) {
                    let secondsPlayed = 0;
                    
                    for (let timeLeft = duration; timeLeft > 0; timeLeft--) {
                        await this.sendHeartbeat();
                        secondsPlayed++;
                        this.totalListeningTime++;
                        
                        this.log(`Time remaining: ${this.formatTime(timeLeft)} | Listening time: ${Math.floor(this.totalListeningTime / 60)} minutes`, true);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    const endSuccess = await this.endMusic(song.id);
                    
                    if (endSuccess) {
                        this.log('Finished playing');
                    } else {
                        this.log('Song ended but playEnd event failed');
                    }

                    this.log(SEPARATOR);
                    await this.getUserInfo();
                    await this.getDailyTasks();
                    break;
                } else {
                    this.log('Failed to play song');
                }
            }

            return true;
        } catch (error) {
            this.log('Error in play session: ' + error.message);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return true;
        }
    }

    async startDailyLoop() {
        while (true) {
            const shouldContinue = await this.playSession();
            
            if (!shouldContinue) {
                this.log('Waiting 24 hours before next session...');
                for (let timeLeft = 24 * 60 * 60; timeLeft > 0; timeLeft--) {
                    this.log(`Next session in: ${this.formatTime(timeLeft)}`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                this.dailyPlayCount = 0;
                this.playedSongs.clear();
                this.totalListeningTime = 0;
                this.log('Starting new daily session');
                await this.getUserInfo();
                await this.getDailyTasks();
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}

async function readTokens() {
    try {
        const content = await fs.readFile('tokens.txt', 'utf-8');
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    } catch (error) {
        console.error('Error reading tokens.txt:', error.message);
        process.exit(1);
    }
}

async function main() {
    const tokens = await readTokens();
    
    if (tokens.length === 0) {
        console.error('No tokens found in tokens.txt');
        process.exit(1);
    }

    console.log(`Found ${tokens.length} account(s)`);
    
    const bots = tokens.map((token, index) => new MusicBot(token, index + 1));
    
    const initResults = await Promise.all(bots.map(bot => bot.initialize()));
    
    const activeBots = bots.filter((_, index) => initResults[index]);
    
    if (activeBots.length === 0) {
        console.error('No accounts could be initialized successfully');
        process.exit(1);
    }

    await Promise.all(activeBots.map(bot => bot.startDailyLoop()));
}

main().catch(console.error);
