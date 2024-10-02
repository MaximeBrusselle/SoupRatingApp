import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

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
            isSpicy: false
        });
        this.getView()?.setModel(oModel, "create");
    }

    public handleSavePress(): void {
        const oModel = this.getView()?.getModel("create");
        // validate the data
        this.getRouter().navTo("Master");
    }

    public handleCancelPress(): void {
        this.getRouter().navTo("Master");
    }
}