import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config(); // loads from .env

// ✅ Use service role key for admin delete
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

test('Login and delete user from Supabase', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Login with Google');

  await page.waitForSelector('text=Logout and Delete', { timeout: 60000 });

  const sessionData = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('supabase.auth.token'));
  });

  const userId = sessionData?.currentSession?.user?.id;
  console.log('Logged-in user ID:', userId);

  expect(userId).toBeTruthy();

  await page.click('text=Logout and Delete');

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(`User deletion failed: ${error.message}`);

  console.log('✅ User deleted successfully from Supabase');
});
