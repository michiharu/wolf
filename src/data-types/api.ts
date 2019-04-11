import { Tree } from "./tree-node";

export const loginURL = '/api/v1/login';
export interface LoginPostRequest { // POST
  id: string;
  password: string;
}
export interface LoginPostResponse {
  id: string;
  lastName: string;
  firstName: string;
}

export const nodeURL = '/api/v1/node';
export type NodeGetResponse = Tree[];

