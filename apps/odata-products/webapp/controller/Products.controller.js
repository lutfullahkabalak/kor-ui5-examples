sap.ui.define([
  "sap/ui/core/Core",
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "kor/ui/Toast"
], (Core, Controller, JSONModel, Toast) => {
  const language = Core.getConfiguration().getLanguage().startsWith("tr") ? "tr" : "en";

  return Controller.extend("kor.example.odataproducts.controller.Products", {
    text(key, args) {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(key, args);
    },
    onLanguage(event) {
      const url = new URL(location.href);
      url.searchParams.set("lang", event.getParameter("key"));
      location.assign(url);
    },

    onInit() {
      this.getView().setModel(new JSONModel({ language, dirty: false, creating: false, draft: {}, categoryText: "" }), "ui");
      document.title = this.text("appTitle");
    },
    model() { return this.getView().getModel(); },
    refreshDirty() { this.getView().getModel("ui").setProperty("/dirty", this.model().hasPendingChanges()); },
    onFilter(event) { this.byId("grid").getBinding("rows").filter(event.getParameter("filters")); },
    onEdit() { this.refreshDirty(); },
    async onDiscard() {
      await this.model().resetChanges();
      this.refreshDirty();
    },
    submit(message) {
      return new Promise((done) => this.model().submitChanges({
        success: (data) => {
          // $batch itself succeeds even when a request inside it fails
          const responses = (data?.__batchResponses ?? []).flatMap((r) => r.__changeResponses ?? [r]);
          const ok = !responses.some((r) => r.response && +r.response.statusCode >= 400);
          Toast.show(this.text(ok ? message : "failed"), ok ? {} : { state: "danger" });
          this.refreshDirty();
          done(ok);
        },
        error: () => { Toast.show(this.text("failed"), { state: "danger" }); done(false); }
      }));
    },
    onSave() { this.submit("saved"); },
    onNew() {
      this.getView().getModel("ui").setData({ creating: true, categoryText: "", draft: { Id: "", Name: "", CategoryId: "", Price: 0, Stock: 0 } }, true);
    },
    onCancel() { this.getView().getModel("ui").setProperty("/creating", false); },
    onCreate() {
      if (!this.byId("form").validate()) return;
      const draft = this.getView().getModel("ui").getProperty("/draft");
      // Edm.Decimal travels as a string
      this.model().create("/Products", { ...draft, Price: draft.Price.toFixed(2), Currency: "EUR" }, {
        success: () => { this.onCancel(); Toast.show(this.text("created")); },
        error: () => Toast.show(this.text("failed"), { state: "danger" })
      });
    }
  });
});
