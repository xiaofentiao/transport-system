import { AxiosRequestConfig } from 'axios';
import { number } from 'echarts/core';

export interface AxiosRequestConfigs extends AxiosRequestConfig {
  loading?: boolean;
  loadingText?: string;
  headers?: any;
}

export interface AxiosResponseType  {
  code: number | string,
  data?: any,
  message?: string | number
}

export interface ResponseConfig  {
  code: number,
  data?: any,
  result?: any,
  message: string,
  total?: number
}