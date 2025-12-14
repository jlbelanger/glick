import Cookies from 'js-cookie';

export default class Auth {
	static login(user, token, remember) {
		Cookies.set(`${import.meta.env.VITE_COOKIE_PREFIX}_user`, JSON.stringify(user), Auth.attributes(remember));
		Cookies.set(`${import.meta.env.VITE_COOKIE_PREFIX}_token`, token, Auth.attributes(remember));
	}

	static refresh() {
		let user = Auth.user();
		user = user ? JSON.parse(user) : null;
		if (user && user.remember) {
			Auth.login(user, Auth.token(), user.remember);
		}
	}

	static attributes(remember) {
		const attributes = {
			sameSite: 'lax',
		};
		if (remember) {
			attributes.expires = 365;
		}
		if (window.location.protocol === 'https:') {
			attributes.secure = true;
		}
		return attributes;
	}

	static logout(status = '') {
		Cookies.remove(`${import.meta.env.VITE_COOKIE_PREFIX}_user`);
		Cookies.remove(`${import.meta.env.VITE_COOKIE_PREFIX}_token`);
		window.location.href = `${import.meta.env.VITE_FRONTEND_URL ? import.meta.env.VITE_FRONTEND_URL : '/'}${status ? `?status=${status}` : ''}`;
	}

	static id() {
		const user = Auth.user();
		return user ? JSON.parse(user).id : null;
	}

	static user() {
		return Cookies.get(`${import.meta.env.VITE_COOKIE_PREFIX}_user`);
	}

	static token() {
		return Cookies.get(`${import.meta.env.VITE_COOKIE_PREFIX}_token`);
	}

	static isLoggedIn() {
		return !!Auth.user() && !!Auth.token();
	}
}
