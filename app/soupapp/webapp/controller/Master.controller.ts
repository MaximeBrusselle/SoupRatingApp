import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import UI5Element from "sap/ui/core/Element";

/**
 * @namespace soupapp.controller
 */
export default class Master extends BaseController {
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {
		const curr = new Date();
		const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
		firstday.setHours(0, 0, 0, 0);
		const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
		lastday.setHours(23, 59, 59, 999);

		const dateFormatting = {
			year: "numeric",
			month: "short",
			day: "numeric",
		} as Intl.DateTimeFormatOptions;
		const oModel = new JSONModel({
			currDay: curr.toLocaleDateString("en-GB", dateFormatting),
			firstDay: firstday.toLocaleDateString("en-GB", dateFormatting),
			lastDay: lastday.toLocaleDateString("en-GB", dateFormatting),
			curr: curr,
			first: firstday,
			last: lastday,
		});
		this.setModel(oModel, "masterInfo");
		const weekSoups = this.byId("idSoup2GridList") as any;
		const template = this.getView()?.byId("idGridListItem") as UI5Element;
		weekSoups.bindItems({
			path: "/Soup", 
			parameters: { 
				$expand: "ratings", 
				$select: 'ID,name,shortDescr,date,avgRating,isVeggie,isSpicy', 
				$orderby: 'avgRating desc,date desc,name asc' 
			},
			filters: [new Filter({ path: "date", operator: "BT", value1: firstday.toISOString(), value2: lastday.toISOString() })],
			template: template
		});
	}

	/**
	 * Called when a soup is selected in the master list.
	 * Gets the id of the selected soup and navigates to the detail page.
	 * @param {sap.ui.base.Event} oEvent the selection change event
	 * @private
	 */
	public onGridListSelectionChange(oEvent: any): void {
		const id = oEvent.getParameter("listItem").getBindingContext().getProperty("ID");
		oEvent.getSource().removeSelections();
		this.getRouter().navTo("Detail", {
			ID: id,
		});
	}

	/**
	 * Called when the user clicks on the "Create Soup" button.
	 * Navigates to the create soup page.
	 * @public
	 * @returns {void}
	 */
	public onCreateButtonPress(): void {
		this.getRouter().navTo("CreateSoup");
	}
}
