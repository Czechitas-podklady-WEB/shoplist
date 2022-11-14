import { User } from "../users.js";
import { Week } from "../lists/week.js";

export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      week?: Week;
    }
  }
}