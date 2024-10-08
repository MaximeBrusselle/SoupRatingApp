import UI5Event from "sap/ui/base/Event";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";

/**
 * @namespace soupapp.controller
 */
export default class Detail extends BaseController {
	private _soupId: string;
	private _oView: View;
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {
		this._oView = this.getView() as View;
		this.getRouter().getRoute("Detail")?.attachPatternMatched(this._onRouteMatched, this);
	}

	/**
	 * Called when the route is matched. Sets the view element to the respective Soup ID.
	 * @param {sap.ui.base.Event} oEvent the event with the route match
	 * @private
	 */
	private _onRouteMatched(oEvent: any): void {
		this._soupId = oEvent.getParameter("arguments").ID;
		this._oView.bindElement(`/Soup(${this._soupId})`, {
			$expand: "ratings",
		});
	}

	/**
	 * Called when the user posts a new rating.
	 * @param {sap.ui.base.Event} oEvent the event with the comment
	 * @public
	 */
	public onFeedInputPost(oEvent: any): void {
		const comment = oEvent.getParameter("value");
		// const score = oEvent.getParameter("score");
		const score = 0;

		const newData = {
			soup_ID: this._soupId,
			rating: score,
			comment: comment,
		};
		console.log("🚀 ~ Detail ~ onFeedInputPost ~ newData:", newData);

		const oBinding = this.getView()?.byId("idRatingsList")?.getBinding("items") as ODataListBinding;
		const oContext = oBinding?.create(newData);
		const that = this;

		oContext?.created()?.then(
			function success() {
				console.log("🚀 ~ CreateRating ~ onFeedInputPost ~ Success ~ oContext:", oContext);
				oEvent.getSource().setValue("");
				that._oView.getBinding("items")?.refresh();
			},
			function failure(oError: any) {
				console.log("🚀 ~ CreateRating ~ onFeedInputPost ~ Failure ~ oError:", oError);
				if (!oError.canceled) {
					throw oError; // unexpected error
				}
			}
		);
	}
}
