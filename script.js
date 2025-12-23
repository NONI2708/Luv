document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    initSPA();
    initGlobalSnow();
    initCursorTrail();
});

function initCursorTrail() {
    let lastX = 0;
    document.addEventListener('mousemove', (e) => {
        // Debounce slightly for performance
        if (Math.abs(e.clientX - lastX) < 5) return;
        lastX = e.clientX;

        const star = document.createElement('div');
        star.className = 'cursor-star';
        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 800);
    });
}

/* --- CORE: AUDIO --- */
function initAudio() {
    if (document.getElementById('bgm-audio')) return;

    // Audio Element
    const audio = document.createElement('audio');
    audio.id = 'bgm-audio';
    audio.src = 'bgm.mp3.m4a';
    audio.loop = true;
    audio.volume = 0.5;
    document.body.appendChild(audio);

    // Toggle Button
    const btn = document.createElement('button');
    btn.innerText = '🎵 Music: Off';
    btn.className = 'btn';
    Object.assign(btn.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: '20000',
        padding: '10px 15px', fontSize: '0.9rem', width: 'auto'
    });
    btn.onclick = (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play().then(() => btn.innerText = '🎵 Music: On');
        } else {
            audio.pause();
            btn.innerText = '🎵 Music: Off';
        }
    };
    document.body.appendChild(btn);

    // Auto-Play Strategy
    const attemptPlay = () => {
        audio.play().then(() => {
            btn.innerText = '🎵 Music: On';
            document.body.removeEventListener('click', attemptPlay);
        }).catch(e => console.log("Waiting for interaction..."));
    };
    attemptPlay();
    document.body.addEventListener('click', attemptPlay);
}

/* --- CORE: SPA ROUTER --- */
function initSPA() {
    // 1. Landing Page Button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            showSection('games-section');
            initGames();
        };
    }

    // 2. Letter -> Proposal
    const toProposalBtn = document.getElementById('to-proposal-btn');
    if (toProposalBtn) {
        toProposalBtn.onclick = () => {
            showSection('proposal-section');
            initProposal();
        };
    }
}

/* --- NAVIGATION WITH CHRISTMAS TRAIN --- */
function showSection(id) {
    const overlay = document.createElement('div');
    overlay.className = 'train-transition-overlay active';
    overlay.innerHTML = `
        <div class="stars" style="opacity:0.5;"></div>
        <div class="santa-train-container">🚂🚃🚃🚃 <span style="font-size:20px; color:white; vertical-align:middle;">To Milky Way...</span></div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
        document.querySelectorAll('.spa-section').forEach(el => {
            el.classList.add('hidden-section');
            el.classList.remove('active-section');
        });
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden-section');
            target.classList.add('active-section');
        }

        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }, 1500); // Longer wait for train to look good
    }, 1000);
}

/* --- FEATURE: GLOBAL SNOW & COMPLIMENTS --- */
function initGlobalSnow() {
    setInterval(() => {
        const s = document.createElement('div');
        s.className = 'snowflake';
        s.innerText = '❄️';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.opacity = Math.random();
        s.style.fontSize = (Math.random() * 20 + 10) + 'px';
        s.style.animationDuration = (Math.random() * 3 + 4) + 's';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 7000);
    }, 300);

    // Floating Compliments
    const msgs = ["You're Beautiful! ✨", "My Angel 👼", "Cutie Pie 🥧", "Gorgeous! 💖", "I Love You ❤️"];
    setInterval(() => {
        const d = document.createElement('div');
        d.className = 'floating-compliment';
        d.innerText = msgs[Math.floor(Math.random() * msgs.length)];
        d.style.top = (Math.random() * 80 + 10) + 'vh';
        d.style.animationDuration = (Math.random() * 5 + 10) + 's';
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 15000);
    }, 4000);
}

/* --- FEATURE: GAMES --- */
function initGames() {
    initMemoryGame();
}

function initMemoryGame() {
    const grid = document.getElementById('memory-game-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const icons = ['🌹', '🍫', '💍', '🧸', '💌', '✨', '🌹', '🍫', '💍', '🧸', '💌', '✨'];
    icons.sort(() => 0.5 - Math.random());

    let chosen = [], chosenIds = [], won = 0;

    icons.forEach((icon, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = i;
        card.innerText = '❓'; // placeholder
        card.onclick = () => {
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
            card.classList.add('flipped');
            card.innerText = icon; // Reveal

            chosen.push(icon);
            chosenIds.push(i);

            if (chosen.length === 2) {
                setTimeout(checkMatch, 500);
            }
        };
        grid.appendChild(card);
    });

    function checkMatch() {
        const cards = grid.children;
        const [id1, id2] = chosenIds;

        if (chosen[0] === chosen[1]) {
            cards[id1].classList.add('matched'); cards[id1].innerText = '✅';
            cards[id2].classList.add('matched'); cards[id2].innerText = '✅';
            won++;
            if (won === icons.length / 2) {
                setTimeout(() => showMysteryBox(() => {
                    document.getElementById('memory-game-section').style.display = 'none';
                    document.getElementById('quiz-section').style.display = 'block';
                    initQuiz();
                }), 800);
            }
        } else {
            cards[id1].classList.remove('flipped'); cards[id1].innerText = '❓';
            cards[id2].classList.remove('flipped'); cards[2].innerText = '❓';
        }
        chosen = []; chosenIds = [];
    }
}

/* --- UPDATED MYSTERY BOX --- */
function showMysteryBox(cb) {
    const box = document.createElement('div');
    Object.assign(box.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        background: 'rgba(20,20,40,0.95)', zIndex: '5000', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white',
        backdropFilter: 'blur(10px)'
    });
    box.innerHTML = `
        <h1 style="color:#ff9ff3; text-shadow:0 0 20px #ff9ff3; font-size: 3rem; margin-bottom: 20px;">A Surprise! 🎁</h1>
        <div class="cute-box-container">
            <div id="m-box" class="cute-box">🎁</div>
        </div>
        <p style="margin-top:20px; font-size:1.5rem; color:#ccc;">(Tap me!)</p>
    `;
    document.body.appendChild(box);

    document.getElementById('m-box').onclick = function () {
        this.innerHTML = '🧸'; // Bear
        box.querySelector('h1').innerText = "Unlimited Cuddles! 🧸";
        box.querySelector('p').innerText = "Coupon Code: LOVE-U-FOREVER";

        // Confetti
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div');
            c.innerText = ['💖', '✨', '🍬'][Math.floor(Math.random() * 3)];
            c.className = 'snowflake';
            c.style.left = Math.random() * 100 + 'vw';
            box.appendChild(c);
        }
        setTimeout(() => {
            box.style.transition = 'opacity 1s';
            box.style.opacity = 0;
            setTimeout(() => {
                box.remove();
                cb();
            }, 1000);
        }, 3000);
    };
}

function initQuiz() {
    const qDiv = document.getElementById('quiz-question-container');
    qDiv.innerHTML = `
        <h3>What makes you the most beautiful girl?</h3>
        <button class="option-btn">Your Smile</button>
        <button class="option-btn">Your Eyes</button>
        <button class="option-btn">Everything! ❤️</button>
    `;
    const btns = qDiv.querySelectorAll('button');
    btns.forEach(b => b.onclick = () => {
        alert("Correct! It's EVERYTHING! 😍");
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('decorator-section').style.display = 'block';
        initDecorator();
    });
}

function initDecorator() {
    const area = document.getElementById('decorator-game-area');
    const bar = document.getElementById('love-bar');
    const pct = document.getElementById('love-percent');
    let val = 0;

    area.onclick = (e) => {
        if (val >= 100) return;
        val += 10;
        bar.style.width = val + '%';
        pct.innerText = val + '% Love';

        // Sticker
        const s = document.createElement('div');
        s.innerText = '💖';
        s.style.position = 'absolute';
        s.style.left = (e.clientX - area.getBoundingClientRect().left) + 'px';
        s.style.top = (e.clientY - area.getBoundingClientRect().top) + 'px';
        s.style.pointerEvents = 'none';
        document.getElementById('love-overlay').appendChild(s);

        if (val >= 100) {
            document.getElementById('game-message').classList.remove('hidden');
            const toLetter = document.getElementById('to-letter-btn');
            toLetter.onclick = () => showSection('letter-section');
        }
    };
}

/* --- EVASIVE NO BUTTON (STRICT BOUNDS) --- */
/* --- EVASIVE NO BUTTON (REPLICA STYLE) --- */
/* --- EVASIVE NO BUTTON (REPLICA STYLE - ROBUST FIX) --- */
function initProposal() {
    const section = document.getElementById('proposal-section');
    section.innerHTML = ''; // Clear for dynamic inject

    // Create Container
    const container = document.createElement('div');
    container.className = 'proposal-container';
    Object.assign(container.style, {
        position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px'
    });

    // 1. Cute Bear Gif (Fixed URL from Reference)
    const gif = document.createElement('img');
    gif.src = 'https://media.tenor.com/_d5q8vJ58t8AAAAi/milk-and-mocha-bear-and-panda-cute.gif';
    gif.style.width = '250px';
    gif.style.borderRadius = '15px';
    gif.style.marginBottom = '20px';
    gif.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    gif.alt = 'Cute Bear Asking';
    container.appendChild(gif);

    // 2. Question
    const h1 = document.createElement('h1');
    h1.innerText = "Will you be my Girlfriend? 🥺";
    h1.style.marginBottom = '40px';
    h1.style.color = '#ff4757';
    h1.style.textShadow = '0 2px 5px rgba(0,0,0,0.1)';
    container.appendChild(h1);

    // 3. Buttons Container (Orbital Area)
    const btnDiv = document.createElement('div');
    Object.assign(btnDiv.style, {
        position: 'relative', width: '100%', height: '200px', // Defined area for buttons
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start'
    });

    const yes = document.createElement('button');
    yes.innerText = "Yes! 💖";
    yes.className = 'btn';
    yes.style.fontSize = '1.5rem';
    yes.style.padding = '15px 40px';
    yes.style.marginRight = '20px'; // Initial Gap
    yes.style.zIndex = '50';
    yes.id = 'yes-btn';

    const no = document.createElement('button');
    no.innerText = "No 😢";
    no.className = 'btn';
    no.style.fontSize = '1.5rem';
    no.style.padding = '15px 40px';
    no.style.position = 'absolute'; // Vital for movement
    no.style.left = '60%'; // Start next to Yes
    no.style.zIndex = '40';
    no.id = 'no-btn';

    btnDiv.appendChild(yes);
    btnDiv.appendChild(no);
    container.appendChild(btnDiv);

    section.appendChild(container);

    // --- EVASION LOGIC (Orbiting) ---
    if (no) {
        const moveNo = () => {
            // Move to random position WITHIN btnDiv
            const w = btnDiv.offsetWidth;
            const h = btnDiv.offsetHeight;
            const bw = no.offsetWidth;
            const bh = no.offsetHeight;

            // Random coordinates constrained to container
            const randomX = Math.floor(Math.random() * (w - bw));
            const randomY = Math.floor(Math.random() * (h - bh));

            no.style.left = randomX + 'px';
            no.style.top = randomY + 'px';
        };

        no.addEventListener('mouseover', moveNo);
        no.addEventListener('touchstart', moveNo); // Mobile support

        // Also subtle movement on mouse approach for desktop
        btnDiv.addEventListener('mousemove', (e) => {
            const rect = no.getBoundingClientRect();
            const dist = Math.sqrt(
                Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
                Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
            );
            if (dist < 80) moveNo();
        });
    }

    // --- YES LOGIC ---
    if (yes) {
        yes.onclick = () => {
            // "YAY" SLIDE
            document.body.innerHTML = '';
            document.body.style.background = '#ff9ff3';

            // Yay Container
            const yayCon = document.createElement('div');
            Object.assign(yayCon.style, {
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100vh', textAlign: 'center', animation: 'fadeIn 1s'
            });

            // Bunny Yay Gif (Replaced Reference URL)
            const yayGif = document.createElement('img');
            // Using generic reliable Happy Bear URL
            yayGif.src = 'https://media.tenor.com/-p_i_11vHjAAAAAi/milk-and-mocha-bear.gif';
            yayGif.style.width = '280px'; yayGif.style.borderRadius = '20px';
            yayGif.style.boxShadow = '0 0 30px white';

            const txt = document.createElement('h1');
            txt.innerHTML = "YAYYY! I Love You So Much! ❤️🥰";
            txt.style.color = 'white'; txt.style.marginTop = '20px'; txt.style.textShadow = '0 0 10px #ff69b4';

            yayCon.appendChild(yayGif);
            yayCon.appendChild(txt);
            document.body.appendChild(yayCon);

            // After 4 seconds, Go to SURPRISE CINEMATIC
            setTimeout(() => {
                // Transition
                const navOverlay = document.createElement('div');
                navOverlay.className = 'train-transition-overlay active';
                navOverlay.innerHTML = '<div class="santa-train-container">🚂🚃🚃🚃 <span style="font-size:20px; color:white; vertical-align:middle;">To Milky Way...</span></div>';
                document.body.appendChild(navOverlay);

                setTimeout(() => {
                    startCinematicFinale();
                }, 2000);
            }, 4000);
        };
    }
}

/* --- MOON NIGHT CINEMATIC FINALE --- */
function startCinematicFinale() {
    document.body.innerHTML = '';
    const stage = document.createElement('div');
    Object.assign(stage.style, {
        width: '100vw', height: '100vh', background: '#000',
        display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative'
    });
    document.body.appendChild(stage);

    // 1. Steamy Window Intro
    const steam = document.createElement('div');
    steam.className = 'steam-overlay';
    steam.style.opacity = '1';
    stage.appendChild(steam);

    // 2. Scene: Moon Night
    const scene = document.createElement('div');
    scene.style.width = '100%'; scene.style.height = '100%'; scene.style.position = 'absolute';
    // Moon CSS
    const moon = document.createElement('div');
    moon.className = 'moon-glow';
    scene.appendChild(moon);
    // Deep starry sky
    scene.style.background = 'linear-gradient(to bottom, #050510, #1a1a2e)';
    for (let i = 0; i < 100; i++) {
        const s = document.createElement('div');
        s.style.position = 'absolute';
        s.style.top = Math.random() * 100 + '%'; s.style.left = Math.random() * 100 + '%';
        s.style.width = Math.random() * 3 + 'px'; s.style.height = s.style.width;
        s.style.background = 'white'; s.style.borderRadius = '50%'; s.style.opacity = Math.random();
        scene.appendChild(s);
    }
    stage.appendChild(scene);

    // Fireworks
    const fwLoop = setInterval(() => {
        const f = document.createElement('div');
        f.innerText = '🎆';
        Object.assign(f.style, {
            position: 'absolute', left: Math.random() * 90 + 'vw', top: Math.random() * 60 + 'vh',
            fontSize: Math.random() * 80 + 50 + 'px', animation: 'explode 1.5s ease-out',
            filter: 'drop-shadow(0 0 20px gold)'
        });
        scene.appendChild(f);
        setTimeout(() => f.remove(), 1500);
    }, 600);

    // 3. Zoom Effect
    setTimeout(() => {
        steam.style.opacity = '0';
        scene.style.transition = 'transform 3s ease-out';
        scene.style.transform = 'scale(1.1)';

        setTimeout(() => steam.remove(), 3000);

        // Text
        const txt = document.createElement('h1');
        txt.innerHTML = "I LOVE YOU<br>SO MUCH! ❤️";
        Object.assign(txt.style, {
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            color: 'white', fontSize: '5rem', textAlign: 'center', textShadow: '0 0 40px #ff9ff3',
            opacity: '0', transition: 'opacity 2s', zIndex: '20', fontFamily: 'serif'
        });
        scene.appendChild(txt);
        setTimeout(() => txt.style.opacity = '1', 500);

        // Shadow Dance
        setTimeout(() => {
            txt.style.opacity = '0';
            setTimeout(() => {
                const couple = document.createElement('div');
                couple.innerText = '👩‍❤️‍💋‍👨';
                Object.assign(couple.style, {
                    position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    fontSize: '250px', filter: 'brightness(0) drop-shadow(0 -10px 20px rgba(255,255,255,0.8))',
                    animation: 'pulse 4s infinite ease-in-out'
                });
                scene.appendChild(couple);

                // Move to Response
                setTimeout(() => {
                    clearInterval(fwLoop);
                    document.body.innerHTML = '';
                    showResponseUI();
                }, 7000);
            }, 2000);
        }, 4000);
    }, 2000);
}

function showResponseUI() {
    document.body.style.background = 'radial-gradient(circle, #ff9ff3, #b53471)';
    document.body.innerHTML = `
        <div class="glass-panel" style="
            background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
            padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3);
            text-align: center; box-shadow: 0 0 30px rgba(0,0,0,0.2); animation: fadeIn 1s;
        ">
            <h1 style="color:white; text-shadow:0 0 10px pink; margin-bottom:20px;">Write for Me... 📝❤️</h1>
            <textarea id="final-txt" style="
                width:300px; height:120px; padding:15px; border-radius:15px; border:none; 
                font-size:1rem; outline:none; box-shadow:inset 0 0 10px rgba(0,0,0,0.1);
            " placeholder="Your feelings..."></textarea><br><br>
            <button id="forward-finale-btn" class="btn">Forward ➡️</button>
        </div>
    `;

    document.getElementById('forward-finale-btn').onclick = () => {
        const txt = document.getElementById('final-txt').value;
        const sub = "My Heart's Response ❤️";
        // Open Mailto in new window/bg if possible, or usually _self
        window.location.href = `mailto:hencceproved2708@gmail.com?subject=${sub}&body=${txt}`;

        // Wait a tiny bit then Start Christmas Finale
        setTimeout(showChristmasFinale, 1000);
    };
}

function showChristmasFinale() {
    document.body.innerHTML = '';
    document.body.style.background = 'linear-gradient(to bottom, #1a2a6c, #b21f1f, #fdbb2d)'; // Sunset/Night gradient

    const con = document.createElement('div');
    con.style.width = '100%'; con.style.height = '100%'; con.style.position = 'relative'; con.style.overflow = 'hidden';
    document.body.appendChild(con);

    // Train dropping gifts
    const train = document.createElement('div');
    train.className = 'santa-train-container';
    train.innerHTML = '🚂🚃🎁🚃🎁🚃';
    train.style.top = '10%'; train.style.bottom = 'auto'; // Top of screen
    train.style.animation = 'trainRide 10s linear infinite';
    con.appendChild(train);

    // Logic to drop gifts from train
    setInterval(() => {
        const gift = document.createElement('div');
        gift.innerText = '🎁';
        gift.className = 'dropping-gift';
        // Randomize drop position closely following train estimated position logic or just random X
        gift.style.left = Math.random() * 100 + 'vw';
        gift.style.top = '15%';
        con.appendChild(gift);
        setTimeout(() => gift.remove(), 2000);
    }, 500);

    // Snowman & Floor
    const snowman = document.createElement('div');
    snowman.innerText = '☃️';
    Object.assign(snowman.style, {
        position: 'absolute', bottom: '20px', right: '30px', fontSize: '180px',
        animation: 'sway 3s infinite ease-in-out', zIndex: '50'
    });
    con.appendChild(snowman);

    const floor = document.createElement('div');
    Object.assign(floor.style, {
        position: 'absolute', bottom: '0', left: '0', width: '100%', height: '50px',
        background: 'white', filter: 'blur(5px)', boxShadow: '0 0 20px white', zIndex: '40'
    });
    con.appendChild(floor);

    // Final Text
    const msg = document.createElement('h1');
    msg.innerText = "Merry Christmas & Happy New Year!";
    Object.assign(msg.style, {
        position: 'absolute', top: '50%', width: '100%', textAlign: 'center',
        color: 'white', fontSize: '3rem', textShadow: '0 0 20px white',
        animation: 'pulse 2s infinite'
    });
    con.appendChild(msg);
}
