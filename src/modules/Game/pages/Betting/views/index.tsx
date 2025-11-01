import { DepositView } from "./DepositView";

export const BettingView = () => {
  return <div className="w-full h-full p-8">
    <div className="w-full h-full border border-white/10 rounded-lg p-6 bg-black/20">
      <DepositView />
    </div>
  </div>;
};