const { admin } = require("../firebase/config");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Токен не передан" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Неверный токен:", err.message);
    return res.status(401).json({ error: "Неверный или просроченный токен" });
  }
};

module.exports = verifyToken;
