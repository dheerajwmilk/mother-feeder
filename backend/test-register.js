(async () => {
  try {
    const email = 'e2e-test@example.com';
    const password = 'Password123!';
    const fname = 'E2E';
    const lname = 'Tester';
    const phone = '+12345678901';

    console.log('Sending OTP...');
    const sendRes = await fetch('http://localhost:5000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const sendData = await sendRes.json();
    console.log('send-otp response:', sendRes.status, sendData);
    if (!sendRes.ok) {
      console.error('send-otp failed');
      process.exit(1);
    }

    const otp = sendData.otp || '';
    if (!otp) {
      console.error('No OTP returned; cannot continue in dev mode');
      process.exit(1);
    }

    console.log('Registering user with OTP:', otp);
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fname, lname, phone, otp }),
    });
    const regData = await regRes.json();
    console.log('register response:', regRes.status, regData);
  } catch (err) {
    console.error('e2e error', err);
    process.exit(1);
  }
})();
