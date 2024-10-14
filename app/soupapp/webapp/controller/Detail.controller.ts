import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import MessageBox from "sap/m/MessageBox";
import Context from "sap/ui/model/Context";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import JSONModel from "sap/ui/model/json/JSONModel";
import UI5Event from "sap/ui/base/Event";

/**
 * @namespace soupapp.controller
 */
export default class Detail extends BaseController {
	private _soupId: string;
	private _oView: View;
	private _pDialog: Promise<Dialog> | null = null; // Holds reference to the fragment
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {
		this._oView = this.getView() as View;
		this.getRouter().getRoute("Detail")?.attachPatternMatched(this._onRouteMatched, this);
		const reviewModel = new JSONModel({
			comment: "",
			score: 0,
		});
		this._oView.setModel(reviewModel, "review");
	}

	/**
	 * Called when the route is matched. Sets the view element to the respective Soup ID.
	 * @param {sap.ui.base.Event} oEvent the event with the route match
	 * @private
	 */
	private _onRouteMatched(oEvent: any): void {
		this._soupId = oEvent.getParameter("arguments").ID;
		this._oView.bindElement(`/Soups(${this._soupId})`, {
			$expand: "ratings,ingredients",
		});
	}

	/**
	 * Called when the user clicks on the delete button.
	 * Deletes the currently selected soup from the database.
	 * @param {sap.ui.base.Event} oEvent the button press event
	 * @public
	 */
	public onDeleteButtonPress(_: any): void {
		const oBinding = this._oView?.getBindingContext() as any;
		const that = this;

		oBinding?.delete().then(
			function success() {
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

	/**
	 * Copies the currently selected soup to the clipboard as a JSON string.
	 * The resulting JSON object will have the following properties:
	 * - ID: string
	 * - name: string
	 * - shortDescr: string
	 * - longDescr: string
	 * - ingredients: string
	 * - date: Date
	 * - isVeggie: boolean
	 * - isSpicy: boolean
	 * - ratingsCount: number
	 * - avgRating: number
	 * - ratings: { rating: number, comment: string }[]
	 * @public
	 */
	public onCopyButtonPress(): void {
		type RatingsListItem = {
			rating: number;
			comment: string;
		};

		const oBindingContext = this._oView.getBindingContext() as Context;
		const data = {
			ID: oBindingContext.getProperty("ID"),
			name: oBindingContext.getProperty("name"),
			shortDescr: oBindingContext.getProperty("shortDescr"),
			longDescr: oBindingContext.getProperty("longDescr"),
			ingredients: oBindingContext.getProperty("ingredients"),
			date: oBindingContext.getProperty("date"),
			isVeggie: oBindingContext.getProperty("isVeggie"),
			isSpicy: oBindingContext.getProperty("isSpicy"),
			ratingsCount: oBindingContext.getProperty("ratingsCount"),
			avgRating: oBindingContext.getProperty("avgRating"),
			ratings: Array.from({ length: oBindingContext.getProperty("ratingsCount") }, (_, i) => ({
				comment: oBindingContext.getProperty(`ratings/${i}/comment`),
				rating: oBindingContext.getProperty(`ratings/${i}/rating`),
			})) as RatingsListItem[],
		};
		window.navigator.clipboard.writeText(JSON.stringify(data));
	}

	/**
	 * A formatter for rating text that takes a comment and a rating and outputs a string
	 * with the comment followed by a number of stars equal to the rating.
	 * @param {string} comment - The comment part of the rating text.
	 * @param {number} rating - The rating part of the rating text, 1-5.
	 * @returns {string} The formatted rating text.
	 * @private
	 */
	private ratingTextFormatter(comment: string, rating: number): string {
		return `${comment} - ${"⭐".repeat(rating)}`;
	}

	/**
	 * Called when the user clicks on the "Post Review" button.
	 * Opens the "Add Review" dialog to allow the user to enter a new rating.
	 * @private
	 */
	private onPostReviewButtonPress(): void {
		if (!this._pDialog) {
			this._pDialog = Fragment.load({
				name: "soupapp.view.AddReview",
				controller: this,
			}).then((oDialog: any) => {
				this.getView()?.addDependent(oDialog);
				return oDialog;
			});
		}

		this._pDialog.then((oDialog: Dialog) => {
			oDialog.open();
		});
	}

	/**
	 * Closes the Add Review dialog.
	 * @private
	 */
	private onCloseDialog(): void {
		this._pDialog?.then((oDialog: Dialog) => {
			oDialog.close();
		});
	}

	/**
	 * Called when the user clicks on the "Save" button in the "Add Review" dialog.
	 * Creates a new rating with the entered data and refreshes the ratings list.
	 * @param {sap.ui.base.Event} _ the button press event
	 * @private
	 */
	private onSaveButtonPress(_: UI5Event): void {
		const comment = this._oView.getModel("review")?.getProperty("/comment");
		const score = this._oView.getModel("review")?.getProperty("/score");

		const newData = {
			soup_ID: this._soupId,
			rating: score,
			comment: comment,
		};

		const oBinding = this.getView()?.byId("idRatingsList")?.getBinding("items") as ODataListBinding;
		const oContext = oBinding?.create(newData);
		const that = this;

		oContext?.created()?.then(
			function success() {
				(that._oView?.getModel("review") as JSONModel).setProperty("/comment", "");
				(that._oView?.getModel("review") as JSONModel).setProperty("/score", 0);
				that._oView.getElementBinding()?.getModel()?.refresh();
			},
			function failure(oError: any) {
				console.error("🚀 ~ CreateRating ~ onFeedInputPost ~ Failure ~ oError:", oError);
				if (!oError.canceled) {
					throw oError;
				}
			}
		);
		this.onCloseDialog();
	}

	/**
	 * Called when the user clicks on the cancel button in the "Add Review" dialog.
	 * Resets the review form and closes the dialog.
	 * @private
	 */
	private onCancelButtonPress(): void {
		(this._oView?.getModel("review") as JSONModel).setProperty("/comment", "");
		(this._oView?.getModel("review") as JSONModel).setProperty("/score", 0);
		this.onCloseDialog();
	}
}
