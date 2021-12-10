import { StatusType } from "./types";

export const SimpleGenerator: (
  cellCount: number,
  cellWidth: number,
  result: string,
) => () => Generator<number[], void, StatusType> = (
  cellCount,
  cellWidth,
  result
) => {
  const W = cellWidth;
  const SPEED = -18;
  const speedSign = SPEED > 0 ? 1 : SPEED < 0 ? -1 : 0;
  // TODO: SPEED < 0 にのみ対応
  console.assert(speedSign === -1);

  function nownum(now: number) {
    return +result[now];
  }
  function nextpos(pos: number, num: number) {
    const x = Math.ceil((-pos - W * (10 - num)) / (10 * W));
    return -W * (10 - num) - 10 * W * x;
  }
  function prevpos(pos: number, num: number) {
    const x = Math.floor((-pos - W * (10 - num)) / (10 * W));
    return -W * (10 - num) - 10 * W * x;
  }
  return function* () {
    const pos: number[] = new Array(cellCount).fill(0);
    for (let i = 0; i < 60; i++) {
      for (let j = 0; j < cellCount; j++) {
        pos[j] += (i / 60) * SPEED;
      }
      yield pos;
    }
    while (true) {
      for (let j = 0; j < cellCount; j++) {
        pos[j] += SPEED;
      }
      const status = yield pos;
      if (status === "stop") {
        break;
      }
    }
    let now = 0;
    while (now < cellCount - 1) {
      const end = nextpos(pos[now], nownum(now));
      while (true) {
        for (let j = now; j < cellCount; j++) {
          pos[j] += SPEED;
        }
        let finish = false;
        if (pos[now] <= end) {
          finish = true;
          pos[now] = end;
        }
        yield pos;
        if (finish) {
          now += 1;
          // 次のセルが停止するまでに少しだけ間隔を空ける
          for (let i = 0; i < 30; i++) {
            for (let j = now; j < cellCount; j++) {
              pos[j] += SPEED;
            }
            yield pos;
          }
          break;
        }
      }
    }
    const length = 128;
    const arr = new Array(length)
      .fill(0)
      .map((_, i) => ((i + 1) / length) * SPEED)
      .reverse();
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const end = nextpos(pos[now] + sum, nownum(now));
    while (true) {
      pos[now] += SPEED;
      let finish = false;
      if (pos[now] < end - sum) {
        finish = true;
      }
      yield pos;
      if (finish) {
        break;
      }
    }
    for (const d of arr) {
      pos[now] += d;
      yield pos;
    }
    const diff = pos[now] - prevpos(pos[now], nownum(now));
    console.assert(diff < 0);
    for (let i = 0; i < 60; i++) {
      pos[now] -= diff / 60;
      yield pos;
    }
  };
};
