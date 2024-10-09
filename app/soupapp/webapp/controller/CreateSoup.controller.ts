import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import MessageBox from "sap/m/MessageBox";
import Input from "sap/m/Input";
import TextArea from "sap/m/TextArea";
import DatePicker from "sap/m/DatePicker";
type SoupCreate = {
	name: string;
	shortDescr: string;
	longDescr: string;
	date: Date;
	ingredients: string;
	isVeggie: boolean;
	isSpicy: boolean;
};

/**
 * @namespace soupapp.controller
 */
export default class CreateSoup extends BaseController {
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {
		const oModel = new JSONModel({
			name: "",
			shortDescr: "",
			longDescr: "",
			ingredients: "",
			date: new Date(),
			isVeggie: false,
			isSpicy: false,
		});
		this.getView()?.setModel(oModel, "create");
	}

	public onSaveButtonPress(): void {
		const oModel = this.getView()?.getModel("create") as JSONModel;
		const oData = oModel.getData();
		const oOdataModel = this.getView()?.getModel();
		const oListBinding = oOdataModel?.bindList("/Soup") as ODataListBinding;
		const newData = {
			name: oData.name,
			shortDescr: oData.shortDescr,
			longDescr: oData.longDescr,
			ingredients: oData.ingredients,
			date: oData.date.toISOString().slice(0, 10),
			isVeggie: oData.isVeggie,
			isSpicy: oData.isSpicy,
			ratings: [],
		};
		console.log("🚀 ~ CreateSoup ~ handleSavePress ~ newData:", newData);
		if (!this.validateData(newData)) {
			MessageBox.error("Make sure all fields are filled in correctly");
			return;
		}

		// const oListBinding = this.getView()?.byId("idSoupGridList")?.getBinding("items") as ODataListBinding;
		var oContext = oListBinding.create(newData);
		const that = this;

		oContext?.created()?.then(
			function () {
				console.log("🚀 ~ CreateSoup ~ handleSavePress ~ oContext:", oContext);
				that.clearFields();
				MessageBox.success(`Soup ${newData.name} created`, {
					title: "Soup successfully created",
					onClose: function () {
						that.getRouter().navTo("Master");
						that.getView()?.getModel()?.refresh();
					}.bind(that),
				});
			},
			function (oError: any) {
				console.log("🚀 ~ CreateSoup ~ onSaveButtonPress ~ oError:", oError);
				const errors = oError.getMessages().join("\n");
				MessageBox.error(errors);
				if (!oError.canceled) {
					throw oError; // unexpected error
				}
			}.bind(this)
		);
	}

	/**
	 * Validates the input data for creating a soup.
	 * If any of the fields are invalid, sets the corresponding input field to an error state.
	 * @param {SoupCreate} newData - The data to be validated.
	 * @returns {boolean} Whether the data is valid or not.
	 */
	private validateData(newData: SoupCreate): boolean {
		let isValid = true;
		if (newData.name.length < 1 || newData.name.length > 111) {
			const input: Input = this.getView()?.byId("idNameInput") as Input;
			input.setValueState("Error");
			input.setValueStateText("Name must be between 1 and 111 characters");

			isValid = false;
		}
		if (newData.shortDescr.length < 1 || newData.shortDescr.length > 111) {
			const input: Input = this.getView()?.byId("idShortDescrInput") as Input;
			input.setValueState("Error");
			input.setValueStateText("Short description must be between 1 and 111 characters");
			isValid = false;
		}
		if (newData.longDescr.length > 300) {
			const input: TextArea = this.getView()?.byId("idLongDescrTextArea") as TextArea;
			input.setValueState("Error");
			input.setValueStateText("Long description must be no more than 300 characters");
			isValid = false;
		}
		if (newData.ingredients.length < 1 || newData.ingredients.length > 500) {
			const input: TextArea = this.getView()?.byId("idIngredientsTextArea") as TextArea;
			input.setValueState("Error");
			input.setValueStateText("Ingredients must be between 1 and 500 characters");
			isValid = false;
		}
		const checkDate = new Date(newData.date);
		if (!newData.date || checkDate.toString() === "Invalid Date") {
			const input: DatePicker = this.getView()?.byId("idDateDatePicker") as DatePicker;
			input.setValueState("Error");
			input.setValueStateText("Date must be a valid date");
			isValid = false;
		}
		return isValid;
	}

	/**
	 * Called when the user clicks on the cancel button.
	 * Resets the view to its initial state and navigates back to the master page.
	 * @public
	 * @returns {void}
	 */
	public onCancelButtonPress(): void {
		this.clearFields();
		this.getRouter().navTo("Master");
	}

	/**
	 * Resets the view to its initial state by clearing all fields and resetting the input controls' value states.
	 * @private
	 * @returns {void}
	 */
	private clearFields(): void {
		const oModel = this.getView()?.getModel("create") as JSONModel;
		oModel.setData({
			name: "",
			shortDescr: "",
			longDescr: "",
			ingredients: "",
			date: new Date(),
			isVeggie: false,
			isSpicy: false,
		});
		(this.getView()?.byId("idNameInput") as Input).setValueState("None");
		(this.getView()?.byId("idShortDescrInput") as Input).setValueState("None");
		(this.getView()?.byId("idLongDescrTextArea") as TextArea).setValueState("None");
		(this.getView()?.byId("idIngredientsTextArea") as TextArea).setValueState("None");
		(this.getView()?.byId("idDateDatePicker") as DatePicker).setValueState("None");
	}
}
