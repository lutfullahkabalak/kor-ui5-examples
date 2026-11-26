sap.ui.define([
  "sap/ui/core/Core",
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "kor/ui/Theme"
], (Core, Controller, JSONModel, Filter, Theme) => {
  const language = Core.getConfiguration().getLanguage().startsWith("tr") ? "tr" : "en";

  return Controller.extend("kor.example.cashdashboard.controller.Dashboard", {
    text(key, args) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(key, args);
    },
    onLanguage(event) {
      const url = new URL(location.href);
      url.searchParams.set("lang", event.getParameter("key"));
      location.assign(url);
    },

    onInit() {
      this.getView().setModel(new JSONModel({ language }), "ui");
      document.title = this.text("appTitle");
      // Pie chart slices: open amount per stage, from the same orders as the list
      const model = this.getOwnerComponent().getModel();
      const fill = () => {
        const stages = ["quoted", "ordered", "shipped", "invoiced"];
        model.setProperty("/byStage", stages.map((key) => ({ key, name: this.text(key), amount: model.getProperty("/orders").filter((o) => o.stage === key).reduce((sum, o) => sum + o.amount, 0) })));
      };
      if (model.getProperty("/orders")) fill(); else model.dataLoaded().then(fill);
    },
    stageText(stage) { return stage ? this.text(stage) : ""; },
    onStop(event) {
      const key = event.getParameter("key");
      this.byId("grid").getBinding("rows").filter(key ? [new Filter("stage", "EQ", key)] : []);
    },
    onColor(event) { Theme.set({ accent: event.getParameter("key") }); },
    onDark(event) { Theme.set({ mode: event.getSource().getSelected() ? "dark" : "light" }); }
  });
});
