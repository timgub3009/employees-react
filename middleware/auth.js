const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma-client");

const auth = async (req, res, next) => {
  try {
    
    // пытаемся достать токен из хэдеров, поля авторизация. если есть, то отделить его по кавычкам (особенность записи - он всегда идет с Bearer и отсечь через split)
    let token = req.headers.authorization.split('Bearer ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // расшифровка 

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    console.log(user);
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Не авторизован" });
  }
};

module.exports = {
  auth,
};
