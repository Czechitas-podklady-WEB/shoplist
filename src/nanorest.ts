import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";

export interface ApiResource {
  status: 'success',
  type: string,
  url: string,
  results: any,
}

export interface ApiResourceRef {
  type: string,
  id: string,
  url: string,
}

export interface ApiError {
  status: 'error',
  errors: any[],
}

export interface ApiResponse {
  success(results: any): void;
  error(httpStatus: number, errors: any[]): void;
}

export const createResource = (
  type: string, results: any, req: Request, res: Response
): ApiResource => ({
  status: 'success',
  type,
  url: `${req.originalUrl}`,
  results,
});

export const createError = (errors: any[]): ApiError => ({
  status: 'error',
  errors,
});

export const resource = (
  type: string, handler: (req: Request, response: ApiResponse) => void,
): RequestHandler => {
  return (req, res) => {
    const response: ApiResponse = {
      success(results: any): void {
        const resource = createResource(type, results, req, res);
        res.status(200).send(resource);
      },
      error(httpStatus: number, errors: any[]) {
        res.status(httpStatus).send(createError(errors));
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response.error(400, errors.array());
    }

    handler(req, response);
  }
};
