import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import MessageBox from "sap/m/MessageBox";

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
		const score = 3;

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
				that._oView.getElementBinding()?.getModel()?.refresh();
			},
			function failure(oError: any) {
				console.error("🚀 ~ CreateRating ~ onFeedInputPost ~ Failure ~ oError:", oError);
				if (!oError.canceled) {
					throw oError; // unexpected error
				}
			}
		);
	}

	/**
	 * Called when the user clicks on the delete button.
	 * Deletes the currently selected soup from the database.
	 * @param {sap.ui.base.Event} oEvent the button press event
	 * @public
	 */
	public onDeleteButtonPress(oEvent: any): void {
		const oBinding = this._oView?.getBindingContext() as any;
		const that = this;

		oBinding?.delete().then(
			function success() {
				console.log("🚀 ~ Detail ~ onDeleteButtonPress ~ success");
				MessageBox.success(`Soup ${that._soupId} deleted`, {
					title: "Soup successfully deleted",
					onClose: function () {
						that.getRouter().navTo("Master");
						that.getView()?.getModel()?.refresh();
					},
				});
			}.bind(this),
			function failure(oError: any) {
				console.error("🚀 ~ Detail ~ onDeleteButtonPress ~ failure ~ oError:", oError);
				MessageBox.error(`Could not delete soup ${that._soupId}: ${oError.message}`);
				if (!oError.canceled) {
					throw oError; // unexpected error
				}
			}
		);
	}
}
