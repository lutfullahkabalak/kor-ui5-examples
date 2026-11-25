import BaseController from "./BaseController";
import type Event from "sap/ui/base/Event";
import type JSONModel from "sap/ui/model/json/JSONModel";
import type Form from "kor/ui/Form";
import Toast from "kor/ui/Toast";

type CustomerRow = { id: string; name: string; city: string; limit: number };

/**
 * @namespace kor.example.typescriptstarter.controller
 */
export default class Customer extends BaseController {
	private id = "";

	public onInit(): void {
		this.router().getRoute("customer")?.attachPatternMatched((event: Event) => {
			this.id = (event.getParameters() as unknown as { arguments: { id: string } }).arguments.id;
			void this.bind();
		});
	}
	// The data may still be loading when the page is opened from a deep link
	private async bind(): Promise<void> {
		const model = this.getOwnerComponent()!.getModel() as JSONModel;
		await model.dataLoaded();
		const rows = model.getProperty("/customers") as CustomerRow[];
		const index = rows.findIndex((row) => row.id === this.id);
		if (index < 0) return this.onBack();
		this.getView()!.bindElement(`/customers/${index}`);
	}
	public onBack(): void {
		this.router().navTo("customers");
	}
	public onSave(): void {
		if ((this.byId("form") as Form).validate()) Toast.show(this.text("saved", [this.id]));
	}
}
