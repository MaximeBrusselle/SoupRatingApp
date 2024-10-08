import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";

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
			ingredients: oData.ingredients || "",
			date: oData.date.toISOString().slice(0, 10),
			isVeggie: oData.isVeggie,
			isSpicy: oData.isSpicy,
            ratings: [],
		};
		console.log("🚀 ~ CreateSoup ~ handleSavePress ~ newData:", newData)
		// const oListBinding = this.getView()?.byId("idSoupGridList")?.getBinding("items") as ODataListBinding;
		var oContext = oListBinding.create(newData);

		oContext?.created()?.then(
			function () {
				console.log("🚀 ~ CreateSoup ~ handleSavePress ~ oContext:", oContext);
                
			},
			function (oError: any) {
				console.log("🚀 ~ CreateSoup ~ onSaveButtonPress ~ oError:", oError)
				if (!oError.canceled) {
					throw oError; // unexpected error
				}
			}
		);
        this.getView()?.getModel()?.refresh();
		// validate the data
		this.getRouter().navTo("Master");
	}

	public onCancelButtonPress(): void {
		this.getRouter().navTo("Master");
	}
}
