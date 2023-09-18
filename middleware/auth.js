const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret');

module.exports = (req, res, next) => {
  /**
   * @todo could use Authentication: Bearer <token> schema
   */
  const token = req.get('x-auth-token');
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({err: {name: err.name, msg: err.message} });
    } else {
      req.user = decoded.user;
      next();
    }
  });
};
