import resolve from "./resolve";

export const requireModule = async (path: string) => {
  const f = await resolve(path);
  return require(f);
};
