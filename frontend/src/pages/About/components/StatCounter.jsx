import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const StatCounter = ({ value, suffix = "", duration = 1.6 }) => {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const startCounting = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <motion.span onViewportEnter={startCounting} viewport={{ once: true }} aria-hidden="true">
      {display.toLocaleString("en-IN")}
      {suffix}
    </motion.span>
  );
};
