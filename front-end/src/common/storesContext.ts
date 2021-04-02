import { createContext } from "react";
import { ShipmentTableStore } from "../shipments/ShipmentTableStore";
import { PostOfficeTableStore } from "../post-offices/PostOfficeTableStore";

/*
Make a storesContext that will contain each of the stores
(docs: https://mobx-react.js.org/recipes-context#multiple-global-stores)
*/
export const storesContext = createContext({
  shipmentTableStore: new ShipmentTableStore(),
  postOfficeTableStore: new PostOfficeTableStore(),
});
