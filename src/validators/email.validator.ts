import { Injectable } from '@angular/core';

@Injectable()
export class EmailValidator {

	isValid(email: string) {
		let atpos = email.indexOf("@");
		let dotpos = email.lastIndexOf(".");

		if(atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
			// Not a valid email address
			return false;
		} else {
			return true;
		}
	}
}
