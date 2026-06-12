require('dotenv').config({ path: '.env.local' });
const { createClerkClient } = require('@clerk/backend');
const fs = require('fs');
const path = require('path');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const { id } = JSON.parse(fs.readFileSync(path.join(__dirname, 'user.json'), 'utf-8'));

(async () => {
  const user = await clerk.users.updateUser(id, {
    publicMetadata: { role: 'ADMIN' },
  });
  console.log('Updated user', user.id, 'publicMetadata:', JSON.stringify(user.publicMetadata));
})().catch((e) => {
  console.error('ERROR', JSON.stringify(e, null, 2));
  process.exit(1);
});
