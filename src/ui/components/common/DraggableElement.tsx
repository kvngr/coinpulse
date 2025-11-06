import { motion, type BoundingBox } from "motion/react";

type DraggableElementProps = {
  children: React.ReactNode;
  dragConstraints:
    | false
    | Partial<BoundingBox>
    | {
        current: Element | null;
      };
};

export const DraggableElement: React.FC<DraggableElementProps> = ({
  children,
  dragConstraints,
}) => {
  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={1}
      dragMomentum={false}
      className="h-fit hover:cursor-move"
    >
      {children}
    </motion.div>
  );
};
