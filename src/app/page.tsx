import { Camera } from "./components/camera";
import { GameStage } from "./components/magnifier/game-stage";

export default function App() {
  return (
    <div>
      <GameStage />
      <Camera showCanvas={false} />
    </div>
  );
}
