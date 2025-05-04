import jwt from "jsonwebtoken";

// Функция генерирует JWT с полезной нагрузкой, содержащей uid (или id), email и роль пользователя.
export const generateToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid || user.id,  // Если пользователь пришёл с Firebase, используется uid, иначе id.
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,       // Секрет, взятый из переменных окружения
    { expiresIn: "1d" }           // Срок действия токена – 1 день
  );
};

// Middleware для проверки аутентификации через JWT
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Проверка наличия заголовка Authorization с префиксом "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Добавляем информацию о пользователе в объект запроса
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};
