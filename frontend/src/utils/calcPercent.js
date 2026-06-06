export const calcPercent = (topics) => {
  if (!topics || !topics.length) return 0;
  const done = topics.filter(t => t.completed).length;
  return Math.round((done / topics.length) * 100);
};