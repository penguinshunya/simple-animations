import { Button, ButtonProps } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { StatusType } from "./types";
import NumberSlot from ".";

interface Props {
}

export const NumberSlotExample: React.VFC<Props> = () => {
  const [status, setStatus] = useState<StatusType>("init");

  const handleFinish = useCallback(() => {
    setStatus("finish");
  }, []);

  const buttonProps: ButtonProps = useMemo(
    () => ({
      color: "primary",
      variant: "contained",
      size: "small",
    }),
    []
  );

  return (
    <div
      style={{
        alignItems: "center",
        columnGap: 8,
        display: "flex",
      }}
    >
      <NumberSlot
        cellWidth={32}
        fontStyle="black"
        length={8}
        result="19891015"
        status={status}
        onFinish={handleFinish}
        style={{ backgroundColor: "transparent" }}
      />
      {status === "init" ? (
        <Button {...buttonProps} onClick={() => setStatus("start")}>
          start
        </Button>
      ) : status === "start" ? (
        <Button {...buttonProps} onClick={() => setStatus("stop")}>
          stop
        </Button>
      ) : (
        <Button {...buttonProps} disabled>
          stop
        </Button>
      )}
    </div>
  );
};

export default NumberSlotExample;
