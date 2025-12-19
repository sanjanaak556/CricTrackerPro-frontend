import Lottie from "lottie-react";
import fourAnim from "../../../assets/lottie/Scored 4.json";
import sixAnim from "../../../assets/lottie/Score 6.json";
import wicketAnim from "../../../assets/lottie/Wicket Cricket.json";

const animations = {
  FOUR: fourAnim,
  SIX: sixAnim,
  WICKET: wicketAnim,
};

const MatchEventAnimation = ({ event }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20">
      <div className="w-72 md:w-96">
        <Lottie animationData={animations[event]} loop={false} />
      </div>
    </div>
  );
};

export default MatchEventAnimation;
