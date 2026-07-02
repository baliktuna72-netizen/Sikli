import type { Variants, Transition } from "motion/react";

/**
 * Fade in from bottom animation
 * Use for: Hero sections, cards on scroll, page content
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/**
 * Fade in from top animation
 * Use for: Dropdowns, modals, notifications
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/**
 * Slide in from left animation
 * Use for: Sidebars, navigation, list items
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/**
 * Slide in from right animation
 * Use for: Panels, drawers, cart sidebars
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Scale up animation
 * Use for: Modals, popups, dialogs
 */
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * Simple fade animation
 * Use for: Overlays, backgrounds, subtle transitions
 */
export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Stagger container for child animations
 * Use with children that have their own variants
 *
 * @example
 * <motion.div variants={staggerContainer} initial="initial" animate="animate">
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={fadeInUp}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Fast stagger for many items
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/**
 * Slow stagger for fewer, larger items
 */
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Default spring transition
 * Use for: Most animations
 */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/**
 * Smooth ease transition
 * Use for: Subtle, elegant animations
 */
export const easeTransition: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

/**
 * Quick transition
 * Use for: Hover effects, quick feedback
 */
export const quickTransition: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

/**
 * Hover scale effect props
 * Use with motion components for card hover effects
 *
 * @example
 * <motion.div {...hoverScale}>
 *   <Card>...</Card>
 * </motion.div>
 */
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springTransition,
};

/**
 * Subtle hover scale for smaller elements
 */
export const hoverScaleSubtle = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: quickTransition,
};

/**
 * Hover lift effect (scale + shadow simulation via y)
 */
export const hoverLift = {
  whileHover: { scale: 1.02, y: -4 },
  whileTap: { scale: 0.98, y: 0 },
  transition: springTransition,
};

/**
 * Button press effect
 */
export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.95 },
  transition: quickTransition,
};

/**
 * Icon hover rotation
 */
export const iconHoverRotate = {
  whileHover: { rotate: 15 },
  transition: springTransition,
};

/**
 * Accordion/collapse animation variants
 * Use with AnimatePresence for expand/collapse
 *
 * @example
 * <AnimatePresence>
 *   {isOpen && (
 *     <motion.div
 *       variants={collapseVariants}
 *       initial="collapsed"
 *       animate="expanded"
 *       exit="collapsed"
 *     >
 *       Content
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 */
export const collapseVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  expanded: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
    transition: {
      height: { duration: 0.3, ease: "easeOut" },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
};

/**
 * Page transition variants
 * Use for route transitions with AnimatePresence
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

/**
 * Carousel slide variants
 * Direction should be passed as custom prop
 *
 * @example
 * <motion.div
 *   custom={direction}
 *   variants={carouselSlide}
 *   initial="enter"
 *   animate="center"
 *   exit="exit"
 * >
 */
export const carouselSlide: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

/**
 * Notification/toast animation
 */
export const notificationVariants: Variants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: quickTransition,
  },
};

/**
 * List item animation for staggered lists
 */
export const listItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

/**
 * Grid item animation for staggered grids
 */
export const gridItem: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};
