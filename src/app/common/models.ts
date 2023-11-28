export type Progress = "COMPLETED" | "INPROGRESS";

export interface IScene {
  background: string;
  scene: string;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IGameObject {
  position: IPosition;
  width: number;
  height: number;
  isFound: boolean;
  isHover: boolean;
  heading: string;
  blurb: string;
  quote: string;
  quoteName?: string;
  quoteCompany?: string;
  statisticsColour: string;
  blurbColour: string;
  quoteColour: string;
  backButtonBackgroundColour: string;
  statistic1: string;
  statistic1text: string;
  statistic2: string;
  statistic2text: string;
  statistic3: string;
  statistic3text: string;
}
