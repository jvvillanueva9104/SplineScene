import { proxy, snapshot, useSnapshot } from "valtio";
import { IGameObject } from "../../common/models";
import { devtools } from "valtio/utils";

export const riveFile: string = "final_interactive_wall.riv";

interface IGameState {
  isGameOver: boolean;
  scene: string;
  background: string;
  allGameObjects: Array<IGameObject>;
  isTransitionVisible?: boolean;
  currentArtBoardFound?: string;
  isItemSelected?: boolean;
}

const initialState: IGameState = {
  isGameOver: false,
  scene: "",
  background: "",
  allGameObjects: [],
  isTransitionVisible: true,
  currentArtBoardFound: "",
  isItemSelected: false,
};

const gameStore = proxy<IGameState>(initialState);
devtools(gameStore, { name: "gameStore" });

export const randomNumber = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const useGameStore = () => {
  return useSnapshot(gameStore);
};

export const checkFinishGame = () => {
  const isOver = isGameOver();
  const snap = snapshot(gameStore);

  if (isOver) {
    gtag("event", "GameOver", {
      app_name: "Interactive Wall",
      screen_name: snap.scene,
    });
  }

  gameStore.isGameOver = isOver;
};

export const isGameOver = () => {
  const store = snapshot(gameStore);
  const gameObjects = store.allGameObjects;
  const items = gameObjects.filter((x) => x.isFound);
  return items.length === gameObjects.length;
};

export const updateFound = (name: string) => {
  const { allGameObjects } = gameStore;
  for (let index = 0; index < allGameObjects.length; index++) {
    const element = allGameObjects[index];
  }

  checkFinishGame();
};

export const updateTransition = (value: boolean) => {
  gameStore.isTransitionVisible = value;
};

export const updateCurrentArtBoardFound = (value: string) => {
  gameStore.currentArtBoardFound = value;

  if (value === "Back_Button") {
    updateItemSelected(false);
  }
};

export const updateItemSelected = (value: boolean) => {
  gameStore.isItemSelected = value;
};
