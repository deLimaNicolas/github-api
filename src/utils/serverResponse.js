export const sendServerResponse = (res, status, data) => {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.json({ ...data, status });
};
