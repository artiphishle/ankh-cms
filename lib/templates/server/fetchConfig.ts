"use server";

import { config } from './config';

export async function fetchConfig() {
  return config;
}
