export const isIndeterminate = <T>(items: T[], predicate: (item: T) => boolean): boolean => {
  const total = items.length;
  const selected = items.filter(predicate).length;

  const allChecked = total > 0 && selected === total;
  const noneChecked = selected === 0;

  return !allChecked && !noneChecked;
};
