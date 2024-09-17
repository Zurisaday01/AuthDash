import { BASE_URL_API } from "@/constants";

export const logout = async () => {
	try {
		await fetch(`${BASE_URL_API}/auth/logout`, { method: 'POST' });
	} catch (error) {
		console.error('Error loging out: ', error);
	}
};
