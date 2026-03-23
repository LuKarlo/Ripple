import { FaFire } from "react-icons/fa";
import { IoGiftOutline } from "react-icons/io5";

interface ProgressBarProps {
  score: number;
  toRedeem: number;
  rewardLabel: string;
  maxScore?: number;
  onRedeem: () => void;
}

export default function ProgressBar({
  score,
  toRedeem,
  rewardLabel,
  maxScore = 50,
  onRedeem,
}: ProgressBarProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="progress-wrapper">
      {/* Barra */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
        <div className="progress-label">
          <FaFire />
          <span>{score} / {maxScore}</span>
        </div>
      </div>

      {/* Banner riscatto — appare solo se ci sono kebab da riscattare */}
      {toRedeem > 0 && (
        <div className="redeem-banner">
          <div className="redeem-text">
            <IoGiftOutline />
            <span>
              <strong>{toRedeem}</strong> {rewardLabel} guadagnat{toRedeem === 1 ? "o" : "i"}!
            </span>
          </div>
          <button className="redeem-btn" onClick={onRedeem}>
            Riscatta
          </button>
        </div>
      )}
    </div>
  );
}