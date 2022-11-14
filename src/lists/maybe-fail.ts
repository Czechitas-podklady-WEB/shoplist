export interface Success<T> {
  status: 'success', 
  value: T,
}

export interface Fail {
  status: 'fail', 
  errors: string[],
}

export type MaybeFail<T> = Success<T> | Fail;

export const success = <T>(value: T): Success<T> => ({
  status: 'success',
  value,
});

export const fail = (...errors: string[]): Fail => ({
  status: 'fail',
  errors,
});
