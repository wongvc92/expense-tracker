export const convertUtcToLocalTime = (date: string) => {
  return new Date(date + "Z"); //Adding "Z" tells JavaScript it's UTC
};
