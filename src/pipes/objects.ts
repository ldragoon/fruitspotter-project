import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'objects',
	pure: false
})
@Injectable()
export class Objects {
  transform(value: any, args: any[] = null): any {
		return Object.keys(value);
	}
}
