const ALLOWED_ORIGINS = [
  "http://localhost:8080",
];

module.exports.addCors = (res = {}, req = {}) => {
  const origin = req.headers?.Origin || req.headers?.origin;
  // console.log(req)
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  // console.log('CORS Origin:', origin, '->', allowedOrigin);
  const defaultHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true', 
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  res.headers = Object.assign({}, defaultHeaders, res.headers || {});
  return res;
};
