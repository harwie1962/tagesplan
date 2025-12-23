// sound.js  (generiert)
window.Sound = (function () {
  let enabled = true;

  function setEnabled(v) { enabled = !!v; }
  function isEnabled() { return enabled; }

  // Eventliste: n = Note (z.B. "C4"), s16 = Start in 1/16, d16 = Dauer in 1/16, v = Velocity (0..1)
  const EVENTS = [
  {
    "n": "F#3",
    "s16": 0,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F#4",
    "s16": 2,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb4",
    "s16": 5,
    "d16": 2,
    "v": 1
  },
  {
    "n": "C#5",
    "s16": 7,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb5",
    "s16": 10,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F#3",
    "s16": 12,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F#4",
    "s16": 15,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb4",
    "s16": 17,
    "d16": 2,
    "v": 1
  },
  {
    "n": "C#5",
    "s16": 20,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb5",
    "s16": 22,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F#3",
    "s16": 25,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb3",
    "s16": 29,
    "d16": 2,
    "v": 1
  },
  {
    "n": "C#4",
    "s16": 32,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F4",
    "s16": 34,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F5",
    "s16": 37,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb3",
    "s16": 39,
    "d16": 2,
    "v": 1
  },
  {
    "n": "C#4",
    "s16": 42,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F4",
    "s16": 44,
    "d16": 2,
    "v": 1
  },
  {
    "n": "F5",
    "s16": 47,
    "d16": 2,
    "v": 1
  },
  {
    "n": "Bb3",
    "s16": 49,
    "d16": 9,
    "v": 1
  }
];

  function noteToMidi(n) {
    n = String(n || "C4").trim();
    const m = n.match(/^([A-Ga-g])([#b]?)(-?\d+)$/);
    if (!m) return 60;
    const letter = m[1].toUpperCase();
    const acc = m[2] || "";
    const oct = parseInt(m[3], 10);
    const base = {C:0, D:2, E:4, F:5, G:7, A:9, B:11}[letter];
    let sem = base;
    if (acc === "#") sem += 1;
    if (acc === "b") sem -= 1;
    return (oct + 1) * 12 + sem;
  }

  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function play() {
    if (!enabled) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      const BPM = 149;
      const QUARTER = 60 / BPM;
      const SIXTEENTH = QUARTER / 4;

      const VOLUME = 0.61;
      const TYPE = "triangle";

      const now = ctx.currentTime + 0.02;

      for (let i = 0; i < EVENTS.length; i++) {
        const e = EVENTS[i];
        if (!e || !e.n) continue;

        const t0 = now + (e.s16 * SIXTEENTH);
        const dur = Math.max(0.03, (e.d16 * SIXTEENTH));

        const o = ctx.createOscillator();
        const g = ctx.createGain();

        o.type = TYPE;
        o.frequency.value = midiToFreq(noteToMidi(e.n));

        o.connect(g);
        g.connect(ctx.destination);

        const v = Math.max(0.0002, VOLUME * (typeof e.v === "number" ? e.v : 0.9));
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(0.02, dur - 0.01));

        o.start(t0);
        o.stop(t0 + dur);
      }

      const last = EVENTS.reduce((mx, e) => Math.max(mx, (e.s16 + e.d16) * SIXTEENTH), 0);
      setTimeout(() => { try { ctx.close(); } catch(e){} }, (last + 0.2) * 1000);

    } catch (e) { }
  }

  return { play, setEnabled, isEnabled };
})();
