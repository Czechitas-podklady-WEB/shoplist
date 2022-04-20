export const success = (response, results) => {
  response.send({
    status: 'success',
    results,
  });
};

export const error = (response, httpStatus, { code, message }) => {
  response.status(httpStatus).send({
    status: 'error',
    code,
    message,
  });
};