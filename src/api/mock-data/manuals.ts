import { AxiosRequestConfig } from 'axios';
import { ManualsQueryResponse, ManualsQueryParams } from '../definitions';
import { manual1 } from './common-data/manuals';

export const postManualsQuery = (config: AxiosRequestConfig) => {
  const { method, url, data: requestJson } = config;
  const req = JSON.parse(requestJson) as ManualsQueryParams;
  const { page, rowsPerPage } = req;
  const count = 500;
  const manuals = [...Array(rowsPerPage)].fill(true)
  .map((t, i) => ({
    ...manual1,
    title: `${manual1.title}(${page * rowsPerPage + i + 1})`
  }));


  const data: ManualsQueryResponse = {
    queryParams: req,
    manuals,
    count,
  };

  console.log(method, url, req, data);
  return [200, data]
};