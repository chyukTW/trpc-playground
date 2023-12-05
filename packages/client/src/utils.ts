export const getLocaleTimeString = (timestamp: string) => {
  return new Date(
    new Date(timestamp).getTime() - new Date().getTimezoneOffset() * 60 * 1000,
  ).toLocaleTimeString();
};
