sap.ui.define([
  "sap/ui/core/Core",
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "kor/ui/Toast"
], (Core, Controller, JSONModel, Toast) => {
  const language = Core.getConfiguration().getLanguage().startsWith("tr") ? "tr" : "en";

  return Controller.extend("kor.example.productionplan.controller.Plan", {
    text(key, args) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(key, args);
    },
    onLanguage(event) {
      const url = new URL(location.href);
      url.searchParams.set("lang", event.getParameter("key"));
      location.assign(url);
    },

    onInit() {
      this.getView().setModel(new JSONModel({ language, view: "schedule" }), "ui");
      document.title = this.text("appTitle");
    },
    state(status) { return { planned: "wait", running: "info", finished: "success" }[status] || "none"; },
    onTaskChange(event) {
      const conflict = event.getParameter("conflict");
      Toast.show(this.text("moved", [event.getParameter("task").getKey()]), conflict ? { state: "wait", text: this.text("conflict") } : {});
    },
    onCardMove(event) {
      const card = event.getParameter("card");
      const to = event.getParameter("to");
      if (to === "finished") card.getBindingContext().getModel().setProperty("progress", 100, card.getBindingContext());
      Toast.show(this.text("movedTo", [card.getKey(), this.text(to)]));
    },
    onTask(event) {
      const item = event.getParameter("task") || event.getParameter("card");
      this.byId("sheet").setBindingContext(item.getBindingContext()).setOpen(true);
    },
    onClose() { this.byId("sheet").setOpen(false); }
  });
});
