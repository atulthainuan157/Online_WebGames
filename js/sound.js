/* ===================================================
   SOUND.JS — Audio control
   =================================================== */

const SoundManager = {
    muted: false,

    play(src) {
        if (this.muted) return;
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
