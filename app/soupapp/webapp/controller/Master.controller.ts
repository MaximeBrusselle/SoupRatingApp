import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace soupapp.controller
 */
export default class Master extends BaseController {
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {}

	public onGridListItemPress(oEvent: any): void {
		MessageToast.show("Pressed item with ID " + oEvent.getSource().getId());
	}

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
}
