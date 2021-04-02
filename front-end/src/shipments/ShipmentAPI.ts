// axios includes TypeScript definitions (docs: https://github.com/axios/axios#typescript)
import axios from "axios";

// Type-Only Import (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
import type { CreateShipmentRequest, Shipment } from "./ShipmentTableModel";
import { apiEndpoint } from "../common/Config";

function createShipmentAPI(newShipment: CreateShipmentRequest) {
  return axios.post<string>(`${apiEndpoint}/shipment/add`, newShipment);
}

function readShipmentsAPI() {
  return axios.get<Shipment[]>(`${apiEndpoint}/shipment/list`);
}

function updateShipmentAPI(shipment: Shipment) {
  return axios.post<string>(`${apiEndpoint}/shipment/update`, shipment);
}

function deleteShipmentAPI(shipmentId: string) {
  return axios.post<string>(`${apiEndpoint}/shipment/delete`, {
    id: shipmentId,
  });
}

export {
  createShipmentAPI,
  readShipmentsAPI,
  updateShipmentAPI,
  deleteShipmentAPI,
};
