import { useCallback, useEffect, useMemo, useRef } from "react";
import { sleep } from "../../common/functions";
import { SimpleGenerator } from "./generators";
import { StatusType } from "./types";

type Props = JSX.IntrinsicElements["canvas"] & {
  cellWidth?: number;
  fontStyle?: string | CanvasGradient | CanvasPattern;
  result?: string;
  status?: StatusType;
  onFinish?: () => void;
};

export const NumberSlot: React.VFC<Props> = ({
  cellWidth: optCellWidth,
  fontStyle: optFontStyle,
  result: rawResult,
  status: rawStatus,
  onFinish,
  ...props
}) => {
  const tickID = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const status = useMemo(() => rawStatus ?? "init", [rawStatus]);
  const refStatus = useRef<StatusType>("init");
  useEffect(() => {
    refStatus.current = status;
  }, [status]);

  // マスの個数と横幅、縦幅
  // これらの情報によってcanvasのサイズが決まる
  const cellWidth = useMemo(() => optCellWidth ?? 32, [optCellWidth]);
  const fontStyle = useMemo(() => optFontStyle ?? "black", [optFontStyle]);

  const result = useMemo(() => rawResult ?? "12345", [rawResult]);
  useEffect(() => void console.assert(/^\d+$/.test(result)), [result]);
  const cellCount = useMemo(() => result.length, [result]);

  const generator = useMemo(() => {
    return SimpleGenerator(cellCount, cellWidth, result);
  }, [cellCount, cellWidth, result]);

  const draw = useCallback(
    (pos: number[]) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const mod = cellWidth * 10;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let j = 0; j < cellCount; j++) {
        for (let k = 0; k <= 12; k++) {
          const num = k % 10;
          const p = ((pos[j] % mod) + mod) % mod;
          const x = cellWidth * j + cellWidth / 2;
          const y = -p + cellWidth * k + cellWidth / 2;
          ctx.font = `${cellWidth}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = fontStyle;
          ctx.fillText(`${num}`, x, y);
        }
      }
    },
    [cellCount, cellWidth, fontStyle]
  );

  const tick = useCallback(
    async (id: number) => {
      const it = generator();
      while (true) {
        const { value: pos } = it.next(refStatus.current);
        if (pos === undefined) break;
        await sleep();
        if (id !== tickID.current) return;
        draw(pos);
      }
      onFinish?.();
    },
    [draw, generator, onFinish]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = cellWidth;
    canvas.width = cellWidth * cellCount;
    if (status === "init") {
      draw(new Array(cellCount).fill(0));
    } else if (status === "start") {
      tick(++tickID.current);
    } else if (status === "finish") {
      const pos = new Array(cellCount).fill(0);
      for (let i = 0; i < cellCount; i++) {
        const num = +result[i];
        pos[i] = -cellWidth * (10 - num);
      }
      draw(pos);
    }
  }, [cellCount, cellWidth, draw, result, status, tick]);

  return <canvas {...props} ref={canvasRef} />;
};

export default NumberSlot;
