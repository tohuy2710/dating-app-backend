const { loginController, meController } = require('../controllers/auth_controller');
const { verifyToken } = require('../utils/auth');

exports.login = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { username, password } = body;

    const result = await loginController({ username, password });

    return {
      statusCode: result.status || 200,
      body: JSON.stringify(result.data || {}),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message || 'Internal error' }),
    };
  }
};

exports.me = async (event) => {
  try {
    const decoded = verifyToken(event);
    const result = await meController(decoded);

    return {
      statusCode: result.status || 200,
      body: JSON.stringify(result.data || {}),
    };
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: err.message || 'Unauthorized' }),
    };
  }
};
