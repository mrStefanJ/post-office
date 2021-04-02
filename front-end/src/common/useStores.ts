import { useContext } from "react";
import { storesContext } from "./storesContext";

/*
Make a custom hook called useStores that can be used to destructure the store or stores,
which is needed within given application component(s)
(docs: https://mobx-react.js.org/recipes-context#multiple-global-stores)
*/
export const useStores = () => useContext(storesContext);
