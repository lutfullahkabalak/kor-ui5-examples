import BaseController from "./BaseController";
import type Event from "sap/ui/base/Event";
import type Shell from "kor/ui/Shell";

/**
 * @namespace kor.example.typescriptstarter.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		document.title = this.text("appTitle");
		this.router().attachRouteMatched((event: Event) => {
			const name = (event.getParameters() as unknown as { name: string }).name;
			(this.byId("shell") as Shell).setSelectedKey(name === "home" ? "home" : "customers");
		});
	}
	public onNavigate(event: Event): void {
		this.router().navTo((event.getParameters() as unknown as { key: string }).key);
	}
}
