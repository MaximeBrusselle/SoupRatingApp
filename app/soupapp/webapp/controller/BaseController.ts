import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
/**
 * @namespace soupapp.controller
 */
export default class BaseController extends Controller {
	/**
	 * Convenience method for getting the router object.
	 * @public
	 * @returns {sap.ui.core.routing.Router} the router for this component
	 */
	public getRouter(): Router {
		return (this.getOwnerComponent() as UIComponent).getRouter();
	}

	/**
	 * Convenience method for getting the model by name in the view.
	 * @public
	 * @param {string} [name] the model name
	 * @returns {sap.ui.model.Model} the model instance
	 */
	public getModel(name?: string): Model | undefined {
		return this.getView()?.getModel(name);
	}
	/**
	 * Convenience method for setting the model on the view.
	 * @public
	 * @param {sap.ui.model.Model} model the model instance
	 * @param {string} [name] the model name
	 * @returns {void}
	 */
	public setModel(model: Model, name?: string): void {
		this.getView()?.setModel(model, name);
	}

	/**
	 * Get the resource bundle for the component.
	 * @public
	 * @returns {sap.base.i18n.ResourceBundle} the resource bundle for the component
	 */
	public getResourceBundle(): ResourceBundle {
		return (
			(this.getOwnerComponent() as UIComponent).getModel(
				"i18n"
			) as ResourceModel
		).getResourceBundle() as ResourceBundle;
	}
	/**
	 * Navigates back to the previous screen or master page.
	 * @public
	 * @returns {void}
	 */
	public onNavBack(): void {
		const sPreviousHash = History.getInstance().getPreviousHash();

		if (sPreviousHash !== undefined) {
			// eslint-disable-next-line
			history.go(-1);
		} else {
			this.getRouter().navTo("master", {}, {}, true);
		}
	}
}
