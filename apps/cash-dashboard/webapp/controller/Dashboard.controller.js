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
