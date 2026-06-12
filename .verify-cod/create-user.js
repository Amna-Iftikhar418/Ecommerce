require('dotenv').config({ path: '.env.local' });
const { createClerkClient } = require('@clerk/backend');
const fs = require('fs');
const path = require('path');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const ts = Date.now();
const email = `cod.verify.${ts}+clerk_test@example.com`;
const password = 'CodVerify!2024Xy';

(async () => {
  // clean up previous test user if recorded
  const prevPath = path.join(__dirname, 'user.json');
  if (fs.existsSync(prevPath)) {
    const prev = JSON.parse(fs.readFileSync(prevPath, 'utf-8'));
    if (prev.id) {
      await clerk.users.deleteUser(prev.id).catch(() => {});
    }
  }

  const user = await clerk.users.createUser({
    emailAddress: [email],
    password,
    skipPasswordChecks: true,
  });
  const out = { id: user.id, email, password };
  fs.writeFileSync(prevPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
})().catch((e) => {
  console.error('ERROR', JSON.stringify(e, null, 2));
  process.exit(1);
});
