import type Component from "../Component";
import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import type Router from "sap/ui/core/routing/Router";
import type ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace kor.example.typescriptstarter.controller
 */
export default class BaseController extends Controller {
	protected router(): Router {
		return (this.getOwnerComponent() as Component).getRouter();
	}
	protected text(key: string, args?: string[]): string {
		const model = (this.getOwnerComponent() as Component).getModel("i18n") as ResourceModel;
		return (model.getResourceBundle() as ResourceBundle).getText(key, args) ?? key;
	}
}
