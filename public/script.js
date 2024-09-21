const userId = prompt("أدخل معرف المستخدم الخاص بك على تيلجرام:");

// جلب بيانات المستخدم
fetch(`/getUser/${userId}`)
  .then(response => response.json())
  .then(user => {
    document.getElementById('username').textContent = userId;
    document.getElementById('points').textContent = user.points;
    document.getElementById('referralLink').textContent = `http://t.me/pwrcnbot/start?startapp=r${userId}`;
  });

// زيادة النقاط عند النقر
function increasePoints() {
  fetch('/updatePoints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('points').textContent = data.points;
      }
    });
}

// نسخ رابط الإحالة
function copyReferralLink() {
  const referralLink = document.getElementById('referralLink').textContent;
  navigator.clipboard.writeText(referralLink).then(() => {
    alert('تم نسخ الرابط!');
  });
}
