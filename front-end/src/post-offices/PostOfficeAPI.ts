// axios includes TypeScript definitions (docs: https://github.com/axios/axios#typescript)
import axios from "axios";

// Type-Only Import (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
import type { CreatePostOfficeRequest, PostOffice } from "./PostOfficeModel";
import { apiEndpoint } from "../common/Config";

function createPostOfficeAPI(newPostOffice: CreatePostOfficeRequest) {
  return axios.post<string>(`${apiEndpoint}/office/add`, newPostOffice);
}

function readPostOfficesAPI() {
  return axios.get<PostOffice[]>(`${apiEndpoint}/office/list`);
}

function updatePostOfficeAPI(postOffice: PostOffice) {
  return axios.post<string>(`${apiEndpoint}/office/update`, postOffice);
}

function deletePostOfficeAPI(postOfficeId: string) {
  return axios.post<string>(`${apiEndpoint}/office/delete`, {
    id: postOfficeId,
  });
}

export {
  createPostOfficeAPI,
  readPostOfficesAPI,
  updatePostOfficeAPI,
  deletePostOfficeAPI,
};
