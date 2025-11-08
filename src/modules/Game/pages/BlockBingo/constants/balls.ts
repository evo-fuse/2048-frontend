import { Images } from "../../../../../assets/images";

export const SPORTS_BALLS = [
    { id: 0, image: Images.BASEBALL, name: "Baseball", weight: 70 },
    { id: 1, image: Images.BASKETBALL, name: "Basketball", weight: 90 },
    { id: 2, image: Images.BILLIARD, name: "Billiard", weight: 60 },
    { id: 3, image: Images.BOWLING, name: "Bowling", weight: 70 },
    { id: 4, image: Images.FOOTBALL, name: "Football", weight: 100 },
    { id: 5, image: Images.GOLF, name: "Golf", weight: 50 },
    { id: 6, image: Images.RUGBY, name: "Rugby", weight: 80 },
    { id: 7, image: Images.TABLETENNIS, name: "Table Tennis", weight: 40 },
    { id: 8, image: Images.TENNIS, name: "Tennis", weight: 60 },
    { id: 9, image: Images.VOLLEYBALL, name: "Volleyball", weight: 90 },
];

// Scoring multipliers
export const MULTIPLIER_2_HORIZONTAL = 2;
export const MULTIPLIER_3_HORIZONTAL = 10;
export const MULTIPLIER_3_DIAGONAL = 30;

// Reward calculation threshold
export const DIVIDE_THRESHOLD = 1800;

export type GameState = "idle" | "playing" | "finished";

