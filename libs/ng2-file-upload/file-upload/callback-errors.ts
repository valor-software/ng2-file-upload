// reports an error that cannot be rethrown, so it still reaches window.onerror and Angular's ErrorHandler
export function reportLater(error: unknown): void {
  setTimeout(() => {
    throw error;
  });
}

// runs then() even when action() throws; if both throw, the first error is rethrown and the second reported later
export function runThen(action: () => void, then: () => void): void {
  try {
    action();
  } catch (e) {
    try {
      then();
    } catch (later) {
      reportLater(later);
    }
    throw e;
  }
  then();
}
