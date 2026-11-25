sap.ui.define([
  "sap/ui/core/Core",
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "kor/ui/Toast"
], (Core, Controller, JSONModel, Toast) => {
  const language = Core.getConfiguration().getLanguage().startsWith("tr") ? "tr" : "en";

  return Controller.extend("kor.example.approvals.controller.Approvals", {
    text(key, args) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(key, args);
    },
    onLanguage(event) {
      const url = new URL(location.href);
      url.searchParams.set("lang", event.getParameter("key"));
      location.assign(url);
    },

    onInit() {
      this.getView().setModel(new JSONModel({ language, rejecting: false, reason: "", reasonError: "", states: { waiting: "wait", approved: "success", rejected: "danger" } }), "ui");
      document.title = this.text("appTitle");
      this.byId("detail").bindElement("/requests/0");
    },
    statusText(status) { return status ? this.text(status) : ""; },
    statusState(status) { return { waiting: "wait", approved: "success", rejected: "danger" }[status] || "none"; },
    orderState(status) { return status === "approved" ? "info" : "none"; },
    supplierText(supplier) { return supplier ? this.text("supplier", [supplier]) : ""; },
    eventText(event, reason) { return event ? this.text(event, [reason]) : ""; },
    onRequest(event) {
      this.byId("detail").bindElement(event.getParameter("context").getPath());
    },
    decide(status, event, reason) {
      const context = this.byId("detail").getBindingContext();
      const model = context.getModel();
      model.setProperty("status", status, context);
      model.setProperty("history", [{ person: this.text("you"), time: this.text("now"), event, reason }, ...context.getProperty("history")], context);
      return context.getProperty("id");
    },
    onApprove() {
      Toast.show(this.text("done", [this.decide("approved", "evApproved")]));
    },
    onReject() {
      const ui = this.getView().getModel("ui");
      ui.setData({ rejecting: true, reason: "", reasonError: "", rejectTitle: this.text("rejectTitle", [this.byId("detail").getBindingContext().getProperty("id")]) }, true);
    },
    onCancel() { this.getView().getModel("ui").setProperty("/rejecting", false); },
    onRejectConfirm() {
      const ui = this.getView().getModel("ui");
      const reason = ui.getProperty("/reason").trim();
      if (!reason) return ui.setProperty("/reasonError", this.text("reasonMissing"));
      this.onCancel();
      Toast.show(this.text("doneRejected", [this.decide("rejected", "evRejected", reason)]), { state: "danger" });
    }
  });
});
