import { Link } from "@mui/material";
import NumberSlotExample from "./number-slot/example";
import RectRotateBoxExample from "./rect-rotate-box/example";

interface Props {}

export const App: React.VFC<Props> = () => {
  return (
    <div>
      <div>
        <Link href="https://github.com/penguinshunya/simple-animations">GitHub</Link>
      </div>
      <RectRotateBoxExample />
      <NumberSlotExample />
    </div>
  );
};

export default App;
