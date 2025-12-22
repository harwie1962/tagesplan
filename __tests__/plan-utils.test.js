const {
  getEffectiveItemMinutes,
  getEffectiveItemTimeStr,
  findCurrentAndNext
} = require("../plan-utils");

describe("Plan helper utilities", () => {
  test("applies the morning offset only before the cutoff", () => {
    const options = {
      offsetMinutes: 30,
      afternoonOffsetMinutes: 0,
      applyAllDay: false,
      morningCutoff: "12:00"
    };

    const breakfast = { time: "07:00", title: "Frühstück" };
    const lunch = { time: "13:00", title: "Mittagessen" };

    expect(getEffectiveItemMinutes(breakfast, options)).toBe(450);
    expect(getEffectiveItemMinutes(lunch, options)).toBe(780);
    expect(getEffectiveItemTimeStr(breakfast, options)).toBe("07:30");

    const { nextIndex } = findCurrentAndNext([breakfast, lunch], 430, options);
    expect(nextIndex).toBe(0);
  });

  test("applies the afternoon offset and wraps correctly over midnight", () => {
    const options = {
      offsetMinutes: 0,
      afternoonOffsetMinutes: 90,
      applyAllDay: false,
      morningCutoff: "12:00"
    };

    const lateSnack = { time: "23:30", title: "Später Snack" };
    const earlyRun = { time: "08:00", title: "Morgendlicher Lauf" };

    expect(getEffectiveItemMinutes(lateSnack, options)).toBe(60);
    expect(getEffectiveItemTimeStr(lateSnack, options)).toBe("01:00");
    expect(getEffectiveItemMinutes(earlyRun, options)).toBe(480);

    const { nextIndex, sorted } = findCurrentAndNext([lateSnack, earlyRun], 20, options);
    expect(nextIndex).toBe(0);
    expect(sorted.map(s => s.eff)).toEqual([60, 480]);
  });
});
