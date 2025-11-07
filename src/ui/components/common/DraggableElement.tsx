import React from "react";

import { motion, useMotionValue, type BoundingBox } from "motion/react";

type DraggableElementProps = {
  children: React.ReactNode;
  dragConstraints:
    | false
    | Partial<BoundingBox>
    | {
        current: Element | null;
      };
  onDragEnd?: (x: number, y: number) => void;
  x?: number;
  y?: number;
};

export const DraggableElement: React.FC<DraggableElementProps> = ({
  children,
  dragConstraints,
  onDragEnd,
  x = 0,
  y = 0,
}) => {
  const motionX = useMotionValue(x);
  const motionY = useMotionValue(y);

  React.useEffect(() => {
    motionX.set(x);
    motionY.set(y);
  }, [x, y, motionX, motionY]);

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={1}
      dragMomentum={false}
      style={{
        position: "absolute",
        x: motionX,
        y: motionY,
      }}
      onDragEnd={(_event, _info) => {
        if (onDragEnd !== undefined) {
          onDragEnd(motionX.get(), motionY.get());
        }
      }}
      className="h-fit w-fit hover:cursor-move"
    >
      {children}
    </motion.div>
  );
};
