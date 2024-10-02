import Formatter from "soupapp/model/formatter";
import BaseController from "./BaseController";

/**
 * @namespace soupapp.controller
 */
export default class Master extends BaseController {
	formatter = Formatter;

	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {}

	/**
	 * Called when a soup is selected in the master list.
	 * Gets the id of the selected soup and navigates to the detail page.
	 * @param {sap.ui.base.Event} oEvent the selection change event
	 * @private
	 */
	public onSoupGridListSelectionChange(oEvent: any): void {
		const id = oEvent
			.getParameter("listItem")
			.getBindingContext()
			.getProperty("ID");
		oEvent.getSource().removeSelections();
		this.getRouter().navTo("Detail", {
			ID: id,
		});
	}

	public onButtonCreatePress(): void {
		this.getRouter().navTo("CreateSoup");
	}
}
