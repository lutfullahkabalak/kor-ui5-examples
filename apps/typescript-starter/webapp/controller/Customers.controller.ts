import BaseController from "./BaseController";
import type Event from "sap/ui/base/Event";
import type Context from "sap/ui/model/Context";

/**
 * @namespace kor.example.typescriptstarter.controller
 */
export default class Customers extends BaseController {
	public onCustomer(event: Event): void {
		const { context } = event.getParameters() as unknown as { context: Context };
		this.router().navTo("customer", { id: String(context.getProperty("id")) });
	}
}
