import UI5Event from "sap/ui/base/Event";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

/**
 * @namespace soupapp.controller
 */
export default class Detail extends BaseController {
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {
		this.getRouter().getRoute("Detail")?.attachPatternMatched(this._onRouteMatched, this);
	}

	private _onRouteMatched(oEvent: any): void {
		const oView = this.getView() as View;
		const id = oEvent.getParameter("arguments").ID;
		oView.bindElement(`/Soup(${id})`);
	}

	public onOrderDetailsLinkPress(): void {}

	public onRobotechLinkPress(): void {}

	public onJulieArmstrongLinkPress(): void {}

	public onJohnMillerLinkPress(): void {}

	public onStatusLinkPress(): void {}

	public onAverageUserRatingLinkPress(): void {}
}
