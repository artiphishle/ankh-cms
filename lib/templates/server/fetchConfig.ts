'use server';
import 'server-only';
import { config } from './config';

export async function fetchConfig() {
  return config;
}
