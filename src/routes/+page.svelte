<script>
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  let user = null;
  let profile = null;
  let newEmail = '';
  let newPassword = '';
  let message = '';

  onMount(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Failed to get user:', error.message);
      return;
    }

    user = data.user;

    // Fetch profile from custom 'users' table
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('displayname, provider')
        .eq('uid', user.id)
        .single();

      if (profileError) {
        console.warn('Profile not found:', profileError.message);
      } else {
        profile = profileData;
      }
    }
  });

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Login error:', error.message);
  };

  const updateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    message = error
      ? `❌ Email update failed: ${error.message}`
      : '✅ Email update requested. Please confirm via email.';
  };

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    message = error
      ? `❌ Password update failed: ${error.message}`
      : '✅ Password updated successfully.';
  };

  const logoutAndDelete = async () => {
    const userId = user.id;

    await supabase.auth.signOut();
    user = null;

    await fetch(`/api/delete-user?id=${userId}`, { method: 'DELETE' });

    console.log('Logout done. Delete user in automation script.');
  };
</script>

{#if user}
  <p>Welcome, {user.email}!</p>

  {#if profile}
    <p>Name: {profile.displayname}</p>
    <p>Provider: {profile.provider}</p>
  {/if}

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

  <button on:click={logoutAndDelete} class="mt-6 p-2 bg-red-600 text-white rounded">Logout and Delete</button>

  {#if message}
    <p class="mt-4 text-sm text-blue-600">{message}</p>
  {/if}
{:else}
  <button on:click={signInWithGoogle} class="p-2 bg-blue-500 text-white rounded">
    Login with Google
  </button>
{/if}
