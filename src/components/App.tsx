import NumberSlotExample from "./number-slot/example";
import RectRotateBoxExample from "./rect-rotate-box/example";

interface Props {}

export const App: React.VFC<Props> = () => {
  return (
    <div>
      <RectRotateBoxExample />
      <NumberSlotExample />
    </div>
  );
};

export default App;
