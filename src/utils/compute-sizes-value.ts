interface ComputeSizesValueProps {
  sizes?: string | {
    [x: `${number}rem`]: string;
    [x: `${number}px`]: string;
    fallback?: string;
  };
  desktopFirst?: boolean;
  disableAutoSort?: boolean;
}

const defaultWidthValue = '100vw';

const getSortedBreakpoints = (
  breakpoints: {
    [x: `${number}rem`]: string;
    [x: `${number}px`]: string;
  },
  desktopFirst: boolean,
  disableAutoSort: boolean,
): ({ condition: string; width: string })[] => {
  if (disableAutoSort) {
    return Object
      .entries(breakpoints)
      .map((entity) => {
        const [condition, width] = entity;
        return { condition, width };
      });
  }

  const sortFactor = desktopFirst ? 1 : -1;

  return Object
    .entries(breakpoints)
    .map((entity) => {
      const [condition, width] = entity;
      const value = Number.parseInt(condition, 10) || 0;
      return { value, condition, width };
    })
    .filter((d) => d.value > 0 && Number.parseInt(d.width, 10))
    .sort((a, b) => (sortFactor * (a.value - b.value)))
    .map(({ condition, width }) => ({ condition, width }));
};

export const computeSizesValue = function computeSizesValue({
  sizes = '100vw',
  desktopFirst = false,
  disableAutoSort = false,
}: ComputeSizesValueProps): string {
  if (!sizes) {
    return defaultWidthValue;
  }

  if (typeof sizes === 'string') {
    return sizes;
  }

  const { fallback, ...breakpoints } = sizes;
  const sortedBreakpoints = getSortedBreakpoints(breakpoints, desktopFirst, disableAutoSort);
  const mediaCondition = desktopFirst ? 'max-width' : 'min-width';

  const values = sortedBreakpoints.map((d) => (
    `(${mediaCondition}: ${d.condition}) ${d.width}`
  ));
  values.push(fallback || '100vw');

  return values.join(', ');
};
