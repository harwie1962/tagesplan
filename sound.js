// sound.js
(function () {
  let enabled = true;

  function play() {
    if (!enabled) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      const VOLUME = 0.35;

      // Ton 1
      const o1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      o1.connect(g1);
      g1.connect(ctx.destination);
      o1.type = "sine";
      o1.frequency.value = 900;
      g1.gain.setValueAtTime(VOLUME, ctx.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      o1.start(ctx.currentTime);
      o1.stop(ctx.currentTime + 0.22);

      // Ton 2 (kurz danach)
      setTimeout(() => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.type = "sine";
        o2.frequency.value = 650;
        g2.gain.setValueAtTime(VOLUME, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.30);
        o2.start(ctx.currentTime);
        o2.stop(ctx.currentTime + 0.30);
      }, 140);
    } catch (e) {
      // kein alert, nur still
      console && console.error && console.error("Sound-Fehler:", e);
    }
  }

  function setEnabled(v) {
    enabled = !!v;
  }

  window.Sound = { play, setEnabled };
})();

