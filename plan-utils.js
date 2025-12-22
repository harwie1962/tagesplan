(function(global, factory){
  if (typeof module === "object" && typeof module.exports === "object"){
    module.exports = factory();
  } else {
    global.PlanUtils = factory();
  }
})(typeof window !== "undefined" ? window : this, function(){
  const DEFAULT_MORNING_CUTOFF = "12:00";

  function normalizeMinutes(total){
    return ((total % 1440) + 1440) % 1440;
  }

  function getTimeInMinutes(timeStr){
    const [h, m] = String(timeStr || "").split(":").map(Number);
    return (h * 60) + m;
  }

  function minutesToHHMM(totalMinutes){
    const mod = normalizeMinutes(totalMinutes);
    const h = String(Math.floor(mod / 60)).padStart(2, "0");
    const m = String(mod % 60).padStart(2, "0");
    return `${h}:${m}`;
  }

  function buildOptions(options){
    return {
      morningCutoff: DEFAULT_MORNING_CUTOFF,
      offsetMinutes: 0,
      afternoonOffsetMinutes: 0,
      applyAllDay: false,
      ...(options || {})
    };
  }

  function getPerItemOffset(item, options){
    const opts = buildOptions(options);
    const baseMin = getTimeInMinutes(item.time);
    const cutoffMin = getTimeInMinutes(opts.morningCutoff);

    let off = 0;

    if (opts.applyAllDay || baseMin < cutoffMin){
      off += opts.offsetMinutes || 0;
    }

    if (baseMin >= cutoffMin){
      off += opts.afternoonOffsetMinutes || 0;
    }

    return off;
  }

  function getEffectiveItemMinutes(item, options){
    const perOffset = getPerItemOffset(item, options);
    return normalizeMinutes(getTimeInMinutes(item.time) + perOffset);
  }

  function getEffectiveItemTimeStr(item, options){
    const perOffset = getPerItemOffset(item, options);
    return minutesToHHMM(getTimeInMinutes(item.time) + perOffset);
  }

  function findCurrentAndNext(schedule = [], currentMinutes = 0, options){
    const opts = buildOptions(options);
    const nowMinutes = normalizeMinutes(currentMinutes);

    const indexed = (schedule || []).map((item, index) => ({
      item,
      index,
      eff: getEffectiveItemMinutes(item, opts)
    }));

    indexed.sort((a, b) => a.eff - b.eff);

    const next = indexed.find(x => x.eff > nowMinutes);
    const nextIndex = next ? next.index : -1;

    let currentSortedPos = -1;
    for (let i = 0; i < indexed.length; i++){
      if (indexed[i].eff <= nowMinutes) currentSortedPos = i;
    }
    const currentIndex = currentSortedPos >= 0 ? indexed[currentSortedPos].index : -1;

    return { currentIndex, nextIndex, sorted: indexed };
  }

  return {
    DEFAULT_MORNING_CUTOFF,
    getTimeInMinutes,
    minutesToHHMM,
    getPerItemOffset,
    getEffectiveItemMinutes,
    getEffectiveItemTimeStr,
    findCurrentAndNext
  };
});
