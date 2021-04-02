import { createContext } from "react";

/*
Make sure the shape of the default value passed to createContext matches the shape that the consumers expect
(docs: https://reactjs.org/docs/context.html#updating-context-from-a-nested-component)
*/
export const LoaderContext = createContext((state: boolean) => {});
