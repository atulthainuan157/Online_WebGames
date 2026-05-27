/* ===================================================
   SOUND.JS — Audio control
   =================================================== */

const SoundManager = {
    muted: false,
    audioCtx: null,

    initAudioContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playSynth(type) {
        if (this.muted) return;
        this.initAudioContext();
        
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        
        if (type === 'click') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + 0.1);
        } else if (type === 'hover') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, this.audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + 0.05);
        }
    },

    play(src) {
        if (this.muted) return;
        if (src === 'click' || src === 'hover') {
            this.playSynth(src);
            return;
        }
        try {
            const audio = new Audio(src);
            audio.volume = 0.5;
            audio.play();
        } catch (e) {
            console.warn('SoundManager.play failed:', e);
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Add sound effects to interactive elements across all pages
    const interactiveElements = document.querySelectorAll('a, button, .game-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            SoundManager.play('hover');
        });
        
        el.addEventListener('click', () => {
            SoundManager.play('click');
        });
    });
});
