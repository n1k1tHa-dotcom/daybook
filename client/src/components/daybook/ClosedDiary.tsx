import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Sparkles } from "lucide-react";

type ClosedDiaryProps = {
  onOpen: () => void;
  onCapture: () => void;
};

export default function ClosedDiary({ onOpen, onCapture }: ClosedDiaryProps) {
  return (
    <motion.section
      className="closed-stage"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="closed-copy">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>daybook</span>
        </div>
        <p className="eyebrow"><Sparkles size={13} /> your everyday archive</p>
        <h1>Make a little<br /><em>room for today.</em></h1>
        <p className="closed-description">
          A softer place to plan, notice, and keep the tiny things that would otherwise disappear.
        </p>
        <div className="closed-actions">
          <button className="primary-ink-button" onClick={onOpen}>
            Open today <ArrowUpRight size={17} />
          </button>
          <button className="ghost-action" onClick={onCapture}>
            <Camera size={16} /> Capture a moment
          </button>
        </div>
        <div className="closed-footnote">
          <span className="dot" /> Saturday, October 3, 2026 <span className="slash">/</span> Cozy
        </div>
      </div>

      <button className="diary-cover" onClick={onOpen} aria-label="Open your diary">
        <div className="cover-shadow" />
        <div className="cover-book">
          <div className="cover-spine" />
          <div className="cover-label">
            <span className="cover-label-small">volume</span>
            <strong>notes<br />to keep</strong>
            <span className="cover-label-small">no. 014</span>
          </div>
          <div className="cover-doodle doodle-star">✦</div>
          <div className="cover-doodle doodle-leaf">⌁</div>
          <div className="cover-tape tape-one" />
          <div className="cover-tape tape-two" />
          <div className="cover-corner" />
        </div>
        <div className="cover-hint">click to open <span>↗</span></div>
      </button>
    </motion.section>
  );
}
