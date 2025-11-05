import { FC, useEffect, useRef, useState } from "react";
import Text from "../Text";
import StyledScore from "./StyledScore";
import { useGameContext } from "../../../../context/GameContext";

export interface ScoreBoardProps {
  title: string;
  total: number;
}

const ScoreBoard: FC<ScoreBoardProps> = ({ total = 0, title }) => {
  const { powerup } = useGameContext();
  const totalRef = useRef(total);
  const [score, setScore] = useState(() => total - totalRef.current);

  useEffect(() => {
    setScore(total - totalRef.current);
    totalRef.current = total;
  }, [total]);

  return (
    <div className={`${powerup > 0 ? "bg-cyan-400/80": "bg-black/40"} relative border border-white/20 rounded-lg p-2 box-border flex flex-col items-center justify-center w-[92px] mx-2`}>
      <Text
        fontSize={12}
        texttransform="uppercase"
        fontWeight="bold"
        color={powerup > 0 ? "white" : "tertiary"}
      >
        {title}
      </Text>
      <Text color="foreground" fontWeight="bold" fontSize={18}>
        {total}
      </Text>
      {score > 0 && (
        // Assign a different key to let React render the animation from beginning
        <StyledScore key={total}>
          <Text
            fontSize={powerup > 0 ? 32 : 18}
            fontWeight="bold"
            color="white"
          >
            {score > 0 ? `+${score}` : score}
          </Text>
        </StyledScore>
      )}
    </div>
  );
};

export default ScoreBoard;
