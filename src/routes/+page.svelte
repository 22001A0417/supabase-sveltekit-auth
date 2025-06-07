<script>
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  let user = null;
  let newEmail = '';
  let newPassword = '';
  let message = '';

  // Get logged-in user on mount
  onMount(async () => {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  });

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Login error:', error.message);
  };

  const updateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      message = `❌ Email update failed: ${error.message}`;
    } else {
      message = '✅ Email update requested. Please confirm via email.';
    }
  };

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      message = `❌ Password update failed: ${error.message}`;
    } else {
      message = '✅ Password updated successfully.';
    }
  };
</script>

{#if user}
  <p>Welcome, {user.email}!</p>

  <div class="mt-4">
    <label class="block">Update Email:</label>
    <input bind:value={newEmail} placeholder="New email" class="border p-2 rounded" />
    <button on:click={updateEmail} class="ml-2 p-2 bg-green-500 text-white rounded">Update Email</button>
  </div>

  <div class="mt-4">
    <label class="block">Update Password:</label>
    <input bind:value={newPassword} type="password" placeholder="New password" class="border p-2 rounded" />
    <button on:click={updatePassword} class="ml-2 p-2 bg-yellow-500 text-white rounded">Update Password</button>
  </div>

  {#if message}
    <p class="mt-4 text-sm text-blue-600">{message}</p>
  {/if}
{:else}
  <button on:click={signInWithGoogle} class="p-2 bg-blue-500 text-white rounded">
    Login with Google
  </button>
{/if}
