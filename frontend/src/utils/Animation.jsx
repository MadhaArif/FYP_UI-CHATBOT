export const slideRigth = (delay) => {
  return {
    hidden: {
      x: -24,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        delay: delay,
      },
    },
  };
};

export const SlideLeft = (delay) => {
  return {
    hidden: {
      opacity: 0,
      x: 24,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        delay: delay,
      },
    },
  };
};

export const SlideUp = (delay) => {
  return {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        delay: delay,
      },
    },
  };
};
