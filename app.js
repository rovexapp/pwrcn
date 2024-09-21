const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// لتسهيل التعامل مع البيانات من النماذج
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// تقديم الملفات الثابتة مثل CSS و JS
app.use(express.static('public'));

// مسار لصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// مسار لصفحة الإحالات
app.get('/referrals', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'referrals.html'));
});

// تحميل بيانات المستخدم من ملف JSON
function loadUserData() {
  const data = fs.readFileSync('user.json');
  return JSON.parse(data);
}

// حفظ بيانات المستخدم في ملف JSON
function saveUserData(data) {
  fs.writeFileSync('user.json', JSON.stringify(data, null, 2));
}

// مسار للحصول على بيانات المستخدم
app.get('/getUser/:id', (req, res) => {
  const users = loadUserData().users;
  const user = users.find(user => user.id == req.params.id);

  if (user) {
    res.json(user);
  } else {
    const newUser = { id: req.params.id, points: 0, referrals: [] };
    users.push(newUser);
    saveUserData({ users });
    res.json(newUser);
  }
});

// مسار لتحديث النقاط
app.post('/updatePoints', (req, res) => {
  const { id } = req.body;
  const users = loadUserData().users;
  const user = users.find(user => user.id == id);

  if (user) {
    user.points += 1;
    saveUserData({ users });
    res.json({ success: true, points: user.points });
  } else {
    res.json({ success: false });
  }
});

// مسار لإضافة إحالة
app.post('/addReferral', (req, res) => {
  const { referrerId, referredId } = req.body;
  const users = loadUserData().users;
  const referrer = users.find(user => user.id == referrerId);
  const referred = users.find(user => user.id == referredId);

  if (referrer && referred && !referrer.referrals.includes(referredId)) {
    referrer.referrals.push(referredId);
    referrer.points += 100;
    saveUserData({ users });
    res.json({ success: true, referrerPoints: referrer.points });
  } else {
    res.json({ success: false });
  }
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
