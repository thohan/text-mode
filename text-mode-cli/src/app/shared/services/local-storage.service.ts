import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
	addLocal(key: string, value: any) {
		window.localStorage[key] = this.serialize(value);
	}

	getLocal(key: string) {
		return this.deSerialize(window.localStorage[key]);
	}

	removeLocal(key: string) {
		delete window.localStorage[key];
	}

	addSession(key: string, value: string) {
		window.sessionStorage[key] = this.serialize(value);
	}

	getSession(key: string) {
		return this.deSerialize(window.sessionStorage[key]);
	}

	removeSession(key: string) {
		delete window.sessionStorage[key];
	}

	setCookie(cookieName: string, cookieValue: string, expireDays: number) {
		// if expireDays <= 0 then it will be session expire
		if (!cookieName || !cookieValue) {
			return null;
		}

		if (expireDays > 0) {
			let date = new Date();
			date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
			let expires = '; expires=' + date.toUTCString();
			document.cookie = cookieName + '=' + cookieValue + '; ' + expires + '; path=/';
			return cookieName;
		}

		document.cookie = cookieName + '=' + cookieValue + '; path=/';
		return cookieName;
	}

	getCookie(cookieName: string) {
		const name = cookieName + '=';
		const cookies = document.cookie.split(';');

		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i];

			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1);
			}

			if (cookie.indexOf(name) !== -1) {
				return cookie.substring(name.length, cookie.length);
			}
		}

		return '';
	}

	removeCookie(cookieName: string) {
		document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
	}

	serialize(value: string) {
		return JSON.stringify(value);
	}

	deSerialize(value: string) {
		if (value) {
			return JSON.parse(value);
		} else {
			return undefined;
		}
	}
}
