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
		this.getRouter()
			.getRoute("Detail")
			?.attachPatternMatched(this._onRouteMatched, this);
	}

	/**
	 * Called when the route is matched. Sets the view element to the respective Soup ID.
	 * @param {sap.ui.base.Event} oEvent the event with the route match
	 * @private
	 */
	private _onRouteMatched(oEvent: any): void {
		const oView = this.getView() as View;
		const id = oEvent.getParameter("arguments").ID;
		oView.bindElement(`/Soup(${id})`);
	}

	public onAverageUserRatingLinkPress(): void {}
}
