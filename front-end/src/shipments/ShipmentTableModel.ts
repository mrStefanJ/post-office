// Type-Only Import (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
import type { PostOffice } from "../post-offices/PostOfficeModel";

interface Shipment {
  id: string;
  type: ShipmentType;
  origin: boolean;
  destination: boolean;
  delivered: boolean;
  weight: ShipmentWeight;
  office: PostOffice;
}

interface ShipmentType {
  id: number;
  name: string;
}

interface ShipmentWeight {
  id: number;
  desc: string;
}

interface ShipmentTableColumn {
  id:
    | "id"
    | "type"
    | "origin"
    | "destination"
    | "delivered"
    | "weight"
    | "office";
  label: string;
  formatType?: (data: ShipmentType) => string;
  formatStatus?: (value: boolean) => string;
  formatWeight?: (data: ShipmentWeight) => string;
  formatPostOffice?: (data: PostOffice) => string;
}

interface CreateShipmentRequest {
  type: number;
  origin: boolean;
  destination: boolean;
  delivered: boolean;
  weight: number;
  office: string;
}

// Type-Only Export (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
export type {
  Shipment,
  ShipmentType,
  ShipmentWeight,
  ShipmentTableColumn,
  CreateShipmentRequest,
};
