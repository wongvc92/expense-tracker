const BASE_URL = import.meta.env.VITE_SERVER_URL!;

export const basePath = (value = "") => {
  return `${BASE_URL}${value}`;
};
