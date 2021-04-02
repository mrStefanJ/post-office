import { observable, action } from "mobx";

import { isFiniteNumber, isObject, isArray } from "../common/Config";
// Type-Only Import (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
import type { PostOffice, PostOfficeTableColumn } from "./PostOfficeModel";

/*
It's important to only export the store class here, and not instances of them.
It is considered a bad practice to keep stores globally.
(docs: https://mobx-react.js.org/recipes-context#multiple-global-stores)
*/
export class PostOfficeTableStore {
  columns: PostOfficeTableColumn[] = [
    {
      id: "PLZ",
      label: "Poštanski broj",
      formatZipCode: (value: number) =>
        typeof value === "number" ? String(value) : "",
    },
    {
      id: "name",
      label: "Naziv pošte",
    },
  ];

  selectedRow: { postOffice: PostOffice; rowIndex: number } | null = null;

  @observable
  rows: PostOffice[] = [];

  @action.bound
  setPostOffices(postOffices: PostOffice[]) {
    this.rows = [];

    if (isArray(postOffices)) this.rows = postOffices;
  }

  @action.bound
  updatePostOffice(postOffice: PostOffice, rowIndex: number) {
    if (
      isArray(this.rows) &&
      this.rows.length > 0 &&
      isFiniteNumber(rowIndex) &&
      rowIndex >= 0 &&
      rowIndex <= this.rows.length - 1 &&
      isObject(postOffice)
    )
      this.rows.splice(rowIndex, 1, postOffice);
  }

  @action.bound
  deletePostOffice(rowIndex: number) {
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
