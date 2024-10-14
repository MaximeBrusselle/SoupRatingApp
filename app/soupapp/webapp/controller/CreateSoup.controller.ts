import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import MessageBox from "sap/m/MessageBox";
import Input from "sap/m/Input";
import TextArea from "sap/m/TextArea";
import DatePicker from "sap/m/DatePicker";
import Dialog from "sap/m/Dialog";
import MessageView from "sap/m/MessageView";
import MessageItem from "sap/m/MessageItem";
import Button from "sap/m/Button";
import Bar from "sap/m/Bar";
import Title from "sap/m/Title";
import Table from "sap/m/Table";
import { ISoup } from "soupapp/model/soup";
type SoupIngredient = {
	name: string;
	quantity: string;
	uom: string;
};
type SoupCreate = {
	name: string;
	shortDescr: string;
	longDescr: string;
	date: Date;
	ingredients: SoupIngredient[];
	isVeggie: boolean;
	isSpicy: boolean;
};

/**
 * @namespace soupapp.controller
 */
export default class CreateSoup extends BaseController {
	private oDialog: Dialog;
	private oMessageView: MessageView;

	private oMessageTemplate = new MessageItem({
		type: "{type}",
		title: "{title}",
		subtitle: "{subtitle}",
		groupName: "{group}",
	});
	/*eslint-disable @typescript-eslint/no-empty-function*/
	public onInit(): void {
		const oModel = new JSONModel({
			name: "",
			shortDescr: "",
			longDescr: "",
			ingredients: [
				{
					name: "",
					quantity: "",
					uom: "",
				},
			],
			date: new Date(),
			isVeggie: false,
			isSpicy: false,
			errors: [],
			hasErrors: false,
			nrOfErrors: 0,
		});
		this.getView()?.setModel(oModel, "create");

		this.oMessageView = new MessageView({
			showDetailsPageHeader: false,
			items: {
				path: "create>/errors",
				template: this.oMessageTemplate,
			},
			groupItems: true,
		});
		this.getView()?.addDependent(this.oMessageView);
		const that = this;

		this.oDialog = new Dialog({
			content: this.oMessageView,
			contentHeight: "50%",
			contentWidth: "50%",
			endButton: new Button({
				text: "Close",
				press: function () {
					that.oDialog.close();
				},
			}),
			customHeader: new Bar({
				contentLeft: new Title({
					text: "Errors",
				}),
			}),
			verticalScrolling: false,
		});
	}

	/**
	 * Called when the user clicks on the "Save" button.
	 * Creates a new soup with the entered data and navigates to the master page.
	 * @public
	 * @returns {void}
	 */
	public onSaveButtonPress(): void {
		const oModel = this.getView()?.getModel("create") as JSONModel;
		const oData = oModel.getData();
		const oOdataModel = this.getView()?.getModel();
		const oListBinding = oOdataModel?.bindList("/Soups") as ODataListBinding;

		const newData = {
			name: oData.name,
			shortDescr: oData.shortDescr,
			longDescr: oData.longDescr,
			date: oData.date.toISOString().slice(0, 10),
			isVeggie: oData.isVeggie,
			isSpicy: oData.isSpicy,
			ratings: [],
		};

		if (!this.validateData({ ...newData, ingredients: oData.ingredients })) {
			MessageBox.error("Make sure all fields are filled in correctly");
			(this.getView()?.getModel("create") as JSONModel).refresh();
			return;
		}

		const oContext = oListBinding.create(newData);
		const that = this;

		oContext?.created()?.then(
			async function (oCreatedData: any) {
				const soupId = (oContext.getObject() as ISoup).ID;

				if (oData.ingredients && oData.ingredients.length > 0) {
					await that.createIngredients(soupId, oData.ingredients);
				}

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
				const errors = oError.getMessages().join("\n");
				MessageBox.error(errors);
				if (!oError.canceled) {
					throw oError; // unexpected error
				}
			}.bind(this)
		);
	}

	/**
	 * Creates the ingredients for a given soup
	 * @param {string} soupId ID of the soup to link the ingredients to
	 * @param {Array} ingredients List of ingredients to create
	 * @returns {Promise<void>} Promise that resolves when all ingredients are created
	 * @private
	 */
	private async createIngredients(soupId: string, ingredients: any[]): Promise<void> {
		const oOdataModel = this.getView()?.getModel();
		const oIngredientsBinding = oOdataModel?.bindList("/Ingredients") as ODataListBinding;

		for (const ingredient of ingredients) {
			const ingredientData = {
				soup_ID: soupId, // Link the ingredient to the created Soup
				name: ingredient.name,
				quantity: ingredient.quantity,
				uom: ingredient.uom,
			};

			const oContext = oIngredientsBinding.create(ingredientData);
			await oContext?.created(); // Ensure each ingredient is created
		}
	}

	/**
	 * Validates the input data for creating a soup.
	 * If any of the fields are invalid, sets the corresponding input field to an error state.
	 * @param {SoupCreate} newData - The data to be validated.
	 * @returns {boolean} Whether the data is valid or not.
	 */
	private validateData(newData: SoupCreate): boolean {
		let isValid = true;
		let errors = [];
		if (newData.name.length < 1 || newData.name.length > 111) {
			const input: Input = this.getView()?.byId("idNameInput") as Input;
			input.setValueState("Error");
			input.setValueStateText("Name must be between 1 and 111 characters");
			errors.push({
				type: "Error",
				title: "Name field invalid",
				subtitle: "Name must be between 1 and 111 characters",
				group: "Invalid input",
			});
			isValid = false;
		}
		if (newData.shortDescr.length < 1 || newData.shortDescr.length > 111) {
			const input: Input = this.getView()?.byId("idShortDescrInput") as Input;
			input.setValueState("Error");
			input.setValueStateText("Short description must be between 1 and 111 characters");
			errors.push({
				type: "Error",
				title: "Short description field invalid",
				subtitle: "Short description must be between 1 and 111 characters",
				group: "Invalid input",
			});
			isValid = false;
		}
		if (newData.longDescr.length > 300) {
			const input: TextArea = this.getView()?.byId("idLongDescrTextArea") as TextArea;
			input.setValueState("Error");
			input.setValueStateText("Long description must be no more than 300 characters");
			errors.push({
				type: "Error",
				title: "Long description field invalid",
				subtitle: "Long description must be no more than 300 characters",
				group: "Invalid input",
			});
			isValid = false;
		}
		if (newData.ingredients.length < 1) {
			errors.push({
				type: "Error",
				title: "Ingredients invalid",
				subtitle: "Soup should have at least 1 ingredient",
				group: "Invalid input",
			});
			isValid = false;
		}
		const rows = (this.byId("idIngredientsTable") as Table).getItems();
		for (let i = 0; i < newData.ingredients.length; i++) {
			const row: any = rows[i];
			if (newData.ingredients[i].name.length < 1 || newData.ingredients[i].name.length > 111) {
				row.setProperty("highlight", "Error");
				row.getCells()[0].setValueState("Error");
				row.getCells()[0].setValueStateText("Ingredient name must be between 1 and 111 characters");
				errors.push({
					type: "Error",
					title: "Ingredient name invalid",
					subtitle: "Ingredient name must be between 1 and 111 characters",
					group: "Invalid input",
				});
				isValid = false;
			}
			if (newData.ingredients[i].quantity.length < 1 || newData.ingredients[i].quantity.length > 111) {
				row.setProperty("highlight", "Error");
				row.getCells()[1].setValueState("Error");
				row.getCells()[1].setValueStateText("Ingredient quantity must be between 1 and 111 characters");
				errors.push({
					type: "Error",
					title: "Ingredient quantity invalid",
					subtitle: "Ingredient quantity must be between 1 and 111 characters",
					group: "Invalid input",
				});
				isValid = false;
			}
			if (newData.ingredients[i].uom.length < 1 || newData.ingredients[i].uom.length > 111) {
				row.setProperty("highlight", "Error");
				row.getCells()[2].setValueState("Error");
				row.getCells()[2].setValueStateText("Ingredient uom must be between 1 and 111 characters");
				errors.push({
					type: "Error",
					title: "Ingredient uom invalid",
					subtitle: "Ingredient uom must be between 1 and 111 characters",
					group: "Invalid input",
				});
				isValid = false;
			}
			const checkDate = new Date(newData.date);
			if (!newData.date || checkDate.toString() === "Invalid Date") {
				const input: DatePicker = this.getView()?.byId("idDateDatePicker") as DatePicker;
				input.setValueState("Error");
				input.setValueStateText("Date must be a valid date");
				errors.push({
					type: "Error",
					title: "Date field invalid",
					subtitle: "Date must be a valid date",
					group: "Invalid input",
				});
				isValid = false;
			}
		}
		const oModel = this.getView()?.getModel("create") as JSONModel;
		oModel.setProperty("/errors", errors);
		oModel.setProperty("/nrOfErrors", errors.length);
		oModel.setProperty("/hasErrors", !isValid);
		oModel.refresh();
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
			ingredients: [],
			date: new Date(),
			isVeggie: false,
			isSpicy: false,
			errors: [],
			hasErrors: false,
			nrOfErrors: 0,
		});
		(this.getView()?.byId("idNameInput") as Input).setValueState("None");
		(this.getView()?.byId("idShortDescrInput") as Input).setValueState("None");
		(this.getView()?.byId("idLongDescrTextArea") as TextArea).setValueState("None");
		(this.getView()?.byId("idDateDatePicker") as DatePicker).setValueState("None");
	}

	private onNrOfErrorsButtonPress(): void {
		this.oDialog.open();
	}

	private onAddRowButtonPress(): void {
		this.getView()?.getModel("create")?.getProperty("/ingredients").push({
			name: "",
			quantity: "",
			uom: "",
		});
		this.getView()?.getModel("create")?.refresh();
	}
	private onDeleteSelectedRowsButtonPress(): void {
		const table = this.byId("idIngredientsTable") as Table;
		const selectedItems = table.getSelectedItems();
		// Loop in reverse to avoid index issues
		for (let i = selectedItems.length - 1; i >= 0; i--) {
			const item = selectedItems[i];
			const index = table.indexOfItem(item);
			this.getView()?.getModel("create")?.getProperty("/ingredients").splice(index, 1);
		}
		table.removeSelections(true);
		this.getView()?.getModel("create")?.refresh();
	}
}
