import { Week } from "./lists/week.js";

export interface User {
  email: string,
  password: string,
  week: Week,
  token?: string,
}
