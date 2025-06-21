import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

test('Login and delete user from Supabase', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Sign in with Google');

  await page.waitForSelector('text=Logout and Delete', { timeout: 10000 });

  const userId = await page.getAttribute('#user-id', 'data-uid');
  console.log('🧾 Extracted userId:', userId);

  expect(userId).toBeTruthy();

  await page.click('text=Logout and Delete');

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(`❌ User deletion failed: ${error.message}`);

  console.log('✅ User deleted from Supabase Auth');
});
