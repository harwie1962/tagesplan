// sound.js
// WebAudio-Beep im selben Stil (2 kurze Töne + 1 Wiederholung)
// Nutzung:
//   Sound.unlock();      // 1x per Klick/Touch aufrufen (iOS/Safari)
//   Sound.play();        // bei Termin/Alarm
//   Sound.setEnabled(true/false);
//   Sound.setVolume(0.35);
//   Sound.setRepeat(1);  // 1 = einmal wiederholen (insgesamt 2 Durchläufe)

(function () {
  let enabled = true;
  let volume = 0.35;
  let repeat = 1; // 1 Wiederholung -> insgesamt 2x Pattern
  let ctx = null;
  let unlocked = false;

  function getCtx() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx || ctx.state === "closed") ctx = new AudioCtx();
    return ctx;
  }

  async function unlock() {
    try {
      const c = getCtx();
      if (!c) return false;

      // iOS/Safari: AudioContext muss durch User-Geste gestartet werden
      if (c.state === "suspended") await c.resume();

      // Minimal-Signal, damit es wirklich "freischaltet"
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      o.frequency.value = 440;
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.02);

      unlocked = true;
      return true;
    } catch (e) {
      console && console.error && console.error("Sound unlock Fehler:", e);
      return false;
    }
  }

  function safeNow(c) {
    // kleine Vorlaufzeit, damit Scheduling stabil ist
    return Math.max(c.currentTime, 0) + 0.01;
  }

  function tone(c, when, freq, dur) {
    const o = c.createOscillator();
    const g = c.createGain();

    o.type = "sine";
    o.frequency.setValueAtTime(freq, when);

    o.connect(g);
    g.connect(c.destination);

    // Attack/Decay
    const v = Math.max(0.0001, volume);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(v, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.01, when + dur);

    o.start(when);
    o.stop(when + dur + 0.01);
  }

  function pattern(c, startAt) {
    // 2-Ton-Pattern: erst hoch, dann tiefer
    tone(c, startAt, 900, 0.22);
    tone(c, startAt + 0.14, 650, 0.30);
    // Patternlänge (für Wiederholung)
    return 0.14 + 0.30 + 0.06; // etwas Puffer
  }

  function play() {
    if (!enabled) return;

    try {
      const c = getCtx();
      if (!c) return;

      // wenn gesperrt, still abbrechen (oder: automatisch unlock versuchen)
      if (!unlocked) {
        // optional: im Hintergrund versuchen
        if (c.state === "suspended") c.resume().catch(() => {});
        return;
      }

      if (c.state === "suspended") c.resume().catch(() => {});

      const startAt = safeNow(c);
      const len = pattern(c, startAt);

      // Wiederholung(en)
      const rep = Math.max(0, repeat | 0);
      for (let i = 1; i <= rep; i++) {
        pattern(c, startAt + i * len);
      }
    } catch (e) {
      console && console.error && console.error("Sound-Fehler:", e);
    }
  }

  function setEnabled(v) { enabled = !!v; }
  function setVolume(v) {
    const n = Number(v);
    if (Number.isFinite(n)) volume = Math.max(0, Math.min(1, n));
  }
  function setRepeat(n) {
    const x = Number(n);
    repeat = Number.isFinite(x) ? Math.max(0, x | 0) : 0;
  }

  window.Sound = { play, setEnabled, setVolume, setRepeat, unlock };
})();
