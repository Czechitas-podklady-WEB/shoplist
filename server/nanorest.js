export const sendResource = (req, res, results) => {
  res.send({
    status: 'success',
    url: `${req.originalUrl}`,
    results,
  });
};

export const sendError = (req, res, httpStatus, errors) => {
  res.status(httpStatus).send({
    status: 'error',
    errors,
  });
};
