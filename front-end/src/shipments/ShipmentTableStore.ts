import { observable, action } from "mobx";

import { isFiniteNumber, isObject, isArray } from "../common/Config";
// Type-Only Import (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
import type {
  Shipment,
  ShipmentType,
  ShipmentWeight,
  ShipmentTableColumn,
} from "./ShipmentTableModel";
import type { PostOffice } from "../post-offices/PostOfficeModel";

/*
It's important to only export the store class here, and not instances of them.
It is considered a bad practice to keep stores globally.
(docs: https://mobx-react.js.org/recipes-context#multiple-global-stores)
*/
export class ShipmentTableStore {
  columns: ShipmentTableColumn[] = [
    {
      id: "type",
      label: "Vrsta pošiljke",
      formatType: (data: ShipmentType) =>
        typeof data.name === "string" ? data.name : "",
    },
    {
      id: "origin",
      label: "Primljena i obrađena u GLAVNOJ POŠTI",
      formatStatus: (value: boolean) =>
        typeof value === "boolean" ? (value ? "Da" : "Ne") : "",
    },
    {
      id: "destination",
      label: "Primljena i obrađena u ODREDIŠNOJ POŠTI",
      formatStatus: (value: boolean) =>
        typeof value === "boolean" ? (value ? "Da" : "Ne") : "",
    },
    {
      id: "delivered",
      label: "Isporučena",
      formatStatus: (value: boolean) =>
        typeof value === "boolean" ? (value ? "Da" : "Ne") : "",
    },
    {
      id: "weight",
      label: "Kategorija težine",
      formatWeight: (data: ShipmentWeight) =>
        typeof data.desc === "string" ? data.desc : "",
    },
    {
      id: "office",
      label: "Pošta",
      formatPostOffice: (data: PostOffice) =>
        typeof data.name === "string" ? data.name : "",
    },
  ];

  types: ShipmentType[] = [
    { id: 0, name: "Pismo" },
    { id: 1, name: "Paket" },
  ];

  weights: ShipmentWeight[] = [
    { id: 0, desc: "Manje od 1 kg" },
    { id: 1, desc: "Između 1 i 5 kg" },
    { id: 2, desc: "Više od 5 kg" },
  ];

  selectedRow: { shipment: Shipment; rowIndex: number } | null = null;

  @observable
  rows: Shipment[] = [];

  @action.bound
  setShipments(shipments: Shipment[]) {
    this.rows = [];

    if (isArray(shipments)) this.rows = shipments;
  }

  @action.bound
  updateShipment(shipment: Shipment, rowIndex: number) {
    if (
      isArray(this.rows) &&
      this.rows.length > 0 &&
      isFiniteNumber(rowIndex) &&
      rowIndex >= 0 &&
      rowIndex <= this.rows.length - 1 &&
      isObject(shipment)
    )
      this.rows.splice(rowIndex, 1, shipment);
  }

  @action.bound
  deleteShipment(rowIndex: number) {
    if (
      isArray(this.rows) &&
      this.rows.length > 0 &&
      isFiniteNumber(rowIndex) &&
      rowIndex >= 0 &&
      rowIndex <= this.rows.length - 1
    )
      this.rows.splice(rowIndex, 1);
  }
}
