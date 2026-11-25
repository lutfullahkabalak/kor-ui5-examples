import BaseController from "./BaseController";

/**
 * @namespace kor.example.typescriptstarter.controller
 */
export default class Home extends BaseController {
	public onCustomers(): void {
		this.router().navTo("customers");
	}
}
