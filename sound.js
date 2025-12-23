// assets/sound.js
// Acer-Pad: ultra-einfach, SOLO, max. 1 Takt (4/4), keine Mehrstimmigkeit.

window.Sound = (function () {
  let enabled = true;

  function setEnabled(v) { enabled = !!v; }
  function isEnabled() { return enabled; }

  // AudioContext wiederverwenden
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function play() {
    if (!enabled) return;

    try {
      const audioContext = getCtx();

      const TYPE = "triangle";
      const VOLUME = 0.35;

      // 1 Takt bei 94 BPM (4/4)
      const BPM = 94;
      const QUARTER = 60 / BPM;
      const EIGHTH = QUARTER / 2;

      // SOLO-Melodie (Es-Dur): G4 F4 G4 Ab4 Bb4 C5 D5 Eb5  (8x Achtel = 1 Takt)
      const sequence = [
        { f: 392.00, d: EIGHTH }, // G4
        { f: 349.23, d: EIGHTH }, // F4
        { f: 392.00, d: EIGHTH }, // G4
        { f: 415.30, d: EIGHTH }, // Ab4
        { f: 466.16, d: EIGHTH }, // Bb4
        { f: 523.25, d: EIGHTH }, // C5
        { f: 587.33, d: EIGHTH }, // D5
        { f: 622.25, d: EIGHTH }, // Eb5
      ];

      let t = audioContext.currentTime + 0.05;

      for (const step of sequence) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = TYPE;
        osc.frequency.value = step.f;

        osc.connect(gain);
        gain.connect(audioContext.destination);

        // sehr einfache Hüllkurve (stabil auf schwacher Hardware)
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(VOLUME, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + step.d);

        osc.start(t);
        osc.stop(t + step.d + 0.02);

        t += step.d;
      }
    } catch (e) {
      console.error("Sound-Fehler:", e);
    }
  }

  return { play, setEnabled, isEnabled };
})();
