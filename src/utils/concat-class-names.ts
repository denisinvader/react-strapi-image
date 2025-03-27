export const cx = (...args: Array<string | null | undefined | boolean>): string => {
  let result = '';

  for (let i = 0; i < args.length; i += 1) {
    const className = args[i];
    if (className && typeof className === 'string') {
      result += ' ';
      result += className.trim();
    }
  }

  return result.trim();
};
