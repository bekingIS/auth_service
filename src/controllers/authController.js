const { admin, db } = require("../firebase/config");

// ✅ Регистрация пользователя
const registerUser = async (req, res) => {
  const { email, password, role, walletAddress } = req.body;

  try {
    // Создаем пользователя в Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Сохраняем дополнительные данные в Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
      walletAddress,
    });

    // Генерируем кастомный токен
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.status(201).json({ token, uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Вход пользователя
const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);

    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.json({  uid: user.uid, role: userData.role });
  } catch (error) {
    res.status(401).json({ error: "Invalid email or password" });
  }
};


// ✅ Получение профиля
const getProfile = async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "UID не указан" });
  }

  try {
    const docRef = db.collection("users").doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Профиль не найден" });
    }

    const data = docSnap.data();

    res.status(200).json({
      uid,
      email: data.email || "",
      role: data.role || "unknown",
      walletAddress: data.walletAddress || "",
    });
  } catch (err) {
    console.error("❌ Ошибка при получении профиля:", err.message);
    res.status(500).json({ error: "Ошибка при получении профиля" });
  }
};

module.exports = { registerUser, loginUser, getProfile };
