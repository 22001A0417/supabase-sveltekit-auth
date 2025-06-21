import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.SUPABASE_SERVICE_ROLE_KEY // keep this secret: no VITE_ prefix
);

export async function DELETE({ url }) {
	const userId = url.searchParams.get('id');

	if (!userId) {
		return json({ error: 'Missing user ID' }, { status: 400 });
	}

	// Optional: delete from custom 'users' table
	const { error: dbError } = await supabase
		.from('users')
		.delete()
		.eq('uid', userId);

	if (dbError) {
		return json({ error: 'Custom table deletion failed: ' + dbError.message }, { status: 500 });
	}

	// Delete from Supabase Auth
	const { error: authError } = await supabase.auth.admin.deleteUser(userId);

	if (authError) {
		return json({ error: 'Auth deletion failed: ' + authError.message }, { status: 500 });
	}

	return json({ message: 'User successfully deleted' });
}
