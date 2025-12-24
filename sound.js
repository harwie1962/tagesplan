// sound.js  (generiert)
window.Sound = (function () {
  let enabled = true;

  function setEnabled(v) { enabled = !!v; }
  function isEnabled() { return enabled; }

  // Eventliste: n = Note (z.B. "C4"), s16 = Start in 1/16, d16 = Dauer in 1/16, v = Velocity (0..1)
  const EVENTS = [
  {
    "n": "F#5",
    "s16": 0,
    "d16": 2,
    "v": 0.7874015748031497
  },
  {
    "n": "F#5",
    "s16": 2,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B5",
    "s16": 2,
    "d16": 1,
    "v": 0.9763779527559056
  },
  {
    "n": "D5",
    "s16": 4,
    "d16": 2,
    "v": 0.984251968503937
  },
  {
    "n": "B4",
    "s16": 6,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "F#5",
    "s16": 6,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "A5",
    "s16": 10,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B5",
    "s16": 10,
    "d16": 1,
    "v": 0.9763779527559056
  },
  {
    "n": "B5",
    "s16": 12,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 14,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 14,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 16,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B4",
    "s16": 18,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 18,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 20,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 22,
    "d16": 1,
    "v": 0.7874015748031497
  },
  {
    "n": "B5",
    "s16": 22,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "F#5",
    "s16": 24,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 26,
    "d16": 1,
    "v": 0.984251968503937
  },
  {
    "n": "F#5",
    "s16": 26,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B4",
    "s16": 28,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "B5",
    "s16": 30,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "A5",
    "s16": 32,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 34,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B5",
    "s16": 34,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 36,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B4",
    "s16": 38,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 38,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 40,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 42,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 42,
    "d16": 2,
    "v": 0.7874015748031497
  },
  {
    "n": "B5",
    "s16": 44,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "D5",
    "s16": 46,
    "d16": 2,
    "v": 0.984251968503937
  },
  {
    "n": "F#5",
    "s16": 46,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 48,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B4",
    "s16": 50,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "B5",
    "s16": 52,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "A5",
    "s16": 54,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "B5",
    "s16": 54,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 56,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 58,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 58,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B4",
    "s16": 60,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 62,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 62,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 64,
    "d16": 2,
    "v": 0.7874015748031497
  },
  {
    "n": "F#5",
    "s16": 66,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B5",
    "s16": 66,
    "d16": 1,
    "v": 0.9763779527559056
  },
  {
    "n": "D5",
    "s16": 68,
    "d16": 2,
    "v": 0.984251968503937
  },
  {
    "n": "B4",
    "s16": 70,
    "d16": 2,
    "v": 0.9763779527559056
  },
  {
    "n": "F#5",
    "s16": 70,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "A5",
    "s16": 74,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B5",
    "s16": 74,
    "d16": 1,
    "v": 0.9763779527559056
  },
  {
    "n": "B5",
    "s16": 76,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 78,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 78,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 80,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "B4",
    "s16": 82,
    "d16": 1,
    "v": 0.9133858267716536
  },
  {
    "n": "F#5",
    "s16": 82,
    "d16": 2,
    "v": 0.9133858267716536
  },
  {
    "n": "D5",
    "s16": 84,
    "d16": 2,
    "v": 0.9133858267716536
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

  function calcTotalSteps16() {
    // Gesamtlänge = max(s16 + d16), aufrunden auf volle Takte (16 Steps)
    let maxEnd = 0;
    for (let i=0; i<EVENTS.length; i++) {
      const e = EVENTS[i];
      if (!e) continue;
      const end = (e.s16 || 0) + (e.d16 || 0);
      if (end > maxEnd) maxEnd = end;
    }
    const bars = Math.max(1, Math.ceil(maxEnd / 16));
    return bars * 16;
  }

function play() {
  if (!enabled) return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const BPM = 160;
    const QUARTER = 60 / BPM;
    const SIXTEENTH = QUARTER / 4;

    const VOLUME = 0.46;
    const TYPE = "square";

    // >>> Stabilität bei Mehrstimmigkeit:
    // Für sehr schwache Geräte: 2–3, sonst 4
    const MAX_VOICES = 3;

    const now = ctx.currentTime + 0.02;

    // aktive Stimmen: { osc, stopAt }
    const active = [];

    // Events sortieren: gleicher Start zusammen, dann Tonhöhe
    const sorted = EVENTS.slice().sort((a, b) =>
      (a.s16 - b.s16) || (noteToMidi(a.n) - noteToMidi(b.n))
    );

    for (let i = 0; i < sorted.length; i++) {
      const e = sorted[i];
      if (!e || !e.n) continue;

      const t0 = now + (e.s16 * SIXTEENTH);
      const dur = Math.max(0.03, (e.d16 * SIXTEENTH));
      const stopAt = t0 + dur;

      // abgelaufene Stimmen entfernen
      for (let k = active.length - 1; k >= 0; k--) {
        if (active[k].stopAt <= t0) active.splice(k, 1);
      }

      // wenn zu viele Stimmen gleichzeitig: älteste abschalten ("steal")
      if (active.length >= MAX_VOICES) {
        const victim = active.shift();
        try { victim.osc.stop(t0); } catch (_) {}
      }

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
      o.stop(stopAt);

      active.push({ osc: o, stopAt });
    }

    // garantiert kompletter Durchlauf (aufgerundete Taktlänge)
    const total16 = calcTotalSteps16();
    const totalSec = (total16 * SIXTEENTH) + 0.2;
    setTimeout(() => { try { ctx.close(); } catch(e){} }, totalSec * 1000);

  } catch (e) { }
}

  return { play, setEnabled, isEnabled };
})();
