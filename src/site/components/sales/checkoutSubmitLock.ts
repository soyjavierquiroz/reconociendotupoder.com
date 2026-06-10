export function createCheckoutSubmitLock() {
  let locked = false;

  return {
    isLocked: () => locked,
    run: async (submit: () => Promise<void> | void) => {
      if (locked) {
        return false;
      }

      locked = true;

      try {
        await submit();
        return true;
      } finally {
        locked = false;
      }
    },
  };
}
