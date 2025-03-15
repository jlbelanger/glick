import Cookies from 'js-cookie';

export default class Auth {
	static login(user, token, remember) {
		Cookies.set(`${process.env.REACT_APP_COOKIE_PREFIX}_user`, JSON.stringify(user), Auth.attributes(remember));
		Cookies.set(`${process.env.REACT_APP_COOKIE_PREFIX}_token`, token, Auth.attributes(remember));
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
		Cookies.remove(`${process.env.REACT_APP_COOKIE_PREFIX}_user`);
		Cookies.remove(`${process.env.REACT_APP_COOKIE_PREFIX}_token`);
		window.location.href = `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/'}${status ? `?status=${status}` : ''}`;
	}

	static id() {
		const user = Auth.user();
		return user ? JSON.parse(user).id : null;
	}

	static user() {
		return Cookies.get(`${process.env.REACT_APP_COOKIE_PREFIX}_user`);
	}

	static token() {
		return Cookies.get(`${process.env.REACT_APP_COOKIE_PREFIX}_token`);
	}

	static isLoggedIn() {
		return !!Auth.user() && !!Auth.token();
	}
}
