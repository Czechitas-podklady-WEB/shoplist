import { fail, MaybeFail, success } from "../lists/maybe-fail.js";
import { createDefaultWeek } from "../lists/weeks.js";
import { User } from "../users.js"

export const users: User[] = [
  {
    email: 'podlouckymartin@gmail.com',
    password: 'luskounek',
    week: createDefaultWeek(),
  }
];

export const findUser = (email: string): User | undefined => users.find(
  (user) => user.email === email
);

export const findUserByToken = (token: string): User | undefined => users.find(
  (user) => user.token === token
);

export const registerUser = (email: string, password: string): MaybeFail<User> => {
  const oldUser = findUser(email);

  if (oldUser !== undefined) {
    return fail('This email is already taken');
  }

  if (password.length < 8) {
    return fail('The password must have at least 8 characters');
  }

  const user: User = {
    email, password, week: createDefaultWeek(),
  };

  users.push(user);

  return success(user);
};
