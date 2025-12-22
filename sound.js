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

  // Ersetze in sound.js nur die Funktion pattern(c, startAt)
// Tonfolge: C – Eb – G – C (equal temperament)
// C4=261.63, Eb4=311.13, G4=392.00, C5=523.25

function pattern(c, startAt) {
  const step = 0.16;   // Abstand der Noten
  const dur  = 0.14;   // Dauer je Note

  tone(c, startAt + 0*step, 261.63, dur); // C4
  tone(c, startAt + 1*step, 311.13, dur); // Eb4
  tone(c, startAt + 2*step, 392.00, dur); // G4
  tone(c, startAt + 3*step, 523.25, dur); // C5

  return 4*step + 0.06; // Patternlänge (+Puffer für Wiederholung)
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
