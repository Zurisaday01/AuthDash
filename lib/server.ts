export const logout = async () => {
	try {
		await fetch('/api/auth/logout', { method: 'POST' });
	} catch (error) {
		console.error('Error loging out: ', error);
	}
};
