import { motion, type HTMLMotionProps } from "motion/react";
import {
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleUp,
  fade,
  staggerContainer,
  staggerContainerFast,
  gridItem,
  listItem,
  easeTransition,
} from "./animations";

interface AnimationProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}

/**
 * Fade in from bottom animation
 * Use for: Hero sections, cards, page content
 */
export function FadeIn({
  children,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  ...props
}: AnimationProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{ ...easeTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade in from top animation
 * Use for: Dropdowns, modals, notifications
 */
export function FadeInDown({
  children,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  ...props
}: AnimationProps) {
  return (
    <motion.div
      variants={fadeInDown}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{ ...easeTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide in from left animation
 * Use for: Sidebars, navigation, list items
 */
export function SlideInLeft({
  children,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  ...props
}: AnimationProps) {
  return (
    <motion.div
      variants={slideInLeft}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{ ...easeTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide in from right animation
 * Use for: Panels, drawers, cart sidebars
 */
export function SlideInRight({
  children,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  ...props
}: AnimationProps) {
  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{ ...easeTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale up animation
 * Use for: Modals, popups, dialogs, highlight sections
 */
export function ScaleUp({
  children,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  ...props
}: AnimationProps) {
  return (
    <motion.div
      variants={scaleUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{ ...easeTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Simple fade animation
 * Use for: Overlays, backgrounds, subtle transitions
 */
export function Fade({
  children,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  ...props
}: AnimationProps) {
  return (
    <motion.div
      variants={fade}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      transition={{ ...easeTransition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps extends Omit<AnimationProps, "delay"> {
  fast?: boolean;
}

/**
 * Stagger container for animating children sequentially
 * Use with StaggerItem as children
 */
export function StaggerContainer({
  children,
  fast = false,
  once = true,
  amount = 0.2,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={fast ? staggerContainerFast : staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps
  extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Stagger item - child of StaggerContainer
 * Animates with fadeInUp when parent triggers
 */
export function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={easeTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Grid item for staggered grids
 * Animates with scale effect
 */
export function GridItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={gridItem}
      transition={easeTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * List item for staggered lists
 * Animates with horizontal slide
 */
export function ListItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={listItem}
      transition={easeTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
