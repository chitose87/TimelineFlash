/// <reference path="../libs.d.ts" />
namespace timelineFlash {
	export interface IProperty {
		getPropertyElement():PropertyElementView;
		changeProperty(name:string, val:any, option:any):void;
	}

	export class PropertyObject {
		constructor() {

		}
	}
}