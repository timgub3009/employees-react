const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
  // получить список созданных сотрудников. идет в try, если все ок, то на нем и заканчивается.
  // если есть какая-то ошибка: к примеру, не сработал findMany, то функцию сразу падает в блок catch.
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees); // если все ок, то статус 200 и список сотрудников
  } catch {
    res.status(500).json({ message: "Не удалось получить сотрудников" });
  }
};

const add = async (req, res) => {
  const data = req.body;

  try {
    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: "Все поля обязательные" });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const remove = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Удалено" });
  } catch {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const edit = async (req, res) => {
  const data = req.body;
  const id = data.id;

  try {
    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json({ message: "Обновлено" });
  } catch {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

const employee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch {
    return res.status(500).json({ message: "Что-то пошло не так" });
  }
};

module.exports = {
  all,
  add,
};
