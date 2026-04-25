import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  myResorts: [],
  myResortsSet: new Set(),
  myLessonsSet: new Set(),
});
