import React from "react";

import { motion, type Variants } from "motion/react";

type MousePosition = { x: number; y: number };

export const AnimatedBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const updateMousePosition = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(40deg, rgb(16,24,40), rgb(3,7,18))",
        }}
      />

      <svg className="absolute inset-0 h-0 w-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0 h-full w-full"
        style={{ filter: "url(#goo) blur(80px)" }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            width: "60vmax",
            height: "60vmax",
            background:
              "radial-gradient(circle at center, rgba(18,113,255,0.3) 0%, rgba(18,113,255,0) 50%)",
            mixBlendMode: "hard-light",
          }}
          variants={shape1}
          animate="animate"
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            width: "60vmax",
            height: "60vmax",
            background:
              "radial-gradient(circle at center, rgba(221,74,255,0.3) 0%, rgba(221,74,255,0) 30%)",
            mixBlendMode: "hard-light",
          }}
          variants={shape2}
          animate="animate"
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            width: "60vmax",
            height: "60vmax",
            background:
              "radial-gradient(circle at center, rgba(100,220,255,0.3) 0%, rgba(100,220,255,0) 30%)",
            mixBlendMode: "hard-light",
            opacity: 0.9,
          }}
          variants={shape3}
          animate="animate"
        />

        <motion.div
          className="absolute h-[160vmax] w-[160vmax]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(140,100,255,0.3) 0%, rgba(140,100,255,0) 30%)",
            mixBlendMode: "hard-light",
            top: "-30vmax",
            left: "-30vmax",
          }}
          animate={{ x: mousePosition.x * 0.35, y: mousePosition.y * 0.35 }}
          transition={{ type: "spring", stiffness: 40, damping: 28, mass: 1.2 }}
        />
      </div>
    </div>
  );
};

const shape1: Variants = {
  animate: {
    x: ["-45vw", "35vw", "-40vw"],
    y: ["-35vh", "40vh", "-30vh"],
    rotate: [0, 180, 360],
    transition: {
      duration: 38,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

const shape2: Variants = {
  animate: {
    x: ["35vw", "-40vw", "30vw"],
    y: ["-20vh", "35vh", "-25vh"],
    rotate: [360, 0, -360],
    transition: {
      duration: 52,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

const shape3: Variants = {
  animate: {
    x: ["-30vw", "40vw", "-35vw"],
    y: ["35vh", "-40vh", "30vh"],
    rotate: [0, 120, 240, 360],
    transition: {
      duration: 65,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};
