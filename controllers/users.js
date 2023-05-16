const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body; // что запрашиваем у сервера
  // если все ок, проходится по порядку блок try, если возникает на каком-то этапе ошибка - сразу в catch
  try {
    // если нет почты или пароля
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Пожалуйста, заполните обязательные поля" });
    }
    // призма ищет первое же совпадение почты в схеме user
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    // если почта нашлась (мы ее упаковали в переменную user), то с помощью bcrypt мы сравниваем пароль, который нам вернул сервер с тем паролем, что подтягивается к этой почте (к user). Так как указано await, то это действие произойдет только после того, что записано в const user
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));
    // задаем переменную с секретным ключем, который храним в .env
    const secret = process.env.JWT_SECRET;
    // если почта нашлась, пароль верный и ключ подтянулся (все три соответствия, тк &&), то сервер должен вернуть объект с основными необходимыми данными: айди, почта, имя и токен.
    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "7d" }),
      });
    } else {
      return res
        .status(400)
        .json({ message: "Неверено введен логин или пароль" });
    }
  } catch {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Заполните обязательные поля" });
    }

    // призма ищет первое же совпадение с почтой для того, чтобы не давать создавать юзера с одинаковой почтой дважды
    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registeredUser) {
      return res.status(400).json({ message: "Этот адрес уже используется" });
    }
    // т.н. соль - это добавление символов для шифровки пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // создание пользователя с использованием трех параметров
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const secret = process.env.JWT_SECRET;

    if (user || secret) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "7d" }),
      });
    } else {
      return res
        .status(400)
        .json({ message: "Не удалось создать пользователя" });
    }
  } catch {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};
const current = async (req, res) => {
  // проверка актуального пользователя
  return res.status(200).json(req.user);
};

module.exports = {
  login,
  register,
  current,
};
