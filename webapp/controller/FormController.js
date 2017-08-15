jQuery.sap.require("oui5lib.mapping");
jQuery.sap.require("oui5lib.validation");
jQuery.sap.require("oui5lib.ui");

sap.ui.define([
    "oui5lib/controller/BaseController"
], function(oController) {
    "use strict";

    /**
     * Use the FormController if you have a view with a Form. 
     * @mixin oui5lib.controller.FormController
     */
    var FormController = oController.extend("oui5lib.controller.FormController", {
        defaultDateTimeDisplayFormat: "MMM d, y, HH:mm:ss",
        defaultDateTimeValueFormat: "MMM d, y, HH:mm:ss",
        
        defaultDateDisplayFormat: "short",
        defaultDateValueFormat: "yyyy-MM-dd",

        defaultTimeDisplayFormat: "HH:mm",
        defaultTimeValueFormat: "HH:mm",

        // default: Text
        availableInputTypes: ["Email", "Number", "Password", "Tel", "Text", "Url"],
        
        recordChanged: false,

        /**
         * Mark the record changed.
         * @memberof oui5lib.controller.FormController
         * @public
         */
        setRecordChanged: function() {
            this.recordChanged = true;
        },
        
        /**
         * Reset the record changed status to false (not changed).
         * @memberof oui5lib.controller.FormController
         * @public
         */
        resetRecordChanged: function() {
            this.recordChanged = false;
        },
        
        /**
         * Was the record changed?
         * @memberOf oui5lib.controller.FormController
         * @public
         * @returns {boolean} 'true' if changed, 'false' is unchanged.
         */
        wasRecordChanged: function() {
            return this.recordChanged;
        },

        handleUnsavedChanges: function(action) {
            oui5lib.logger.info("unsavedChanges: " + action);
        },
        
        saveRecord: function() {
            if (this.wasRecordChanged()) {
                this.submitRecord();
            } else {
                oui5lib.logger.debug("nothing to save");
            }
        },
        
        addInput: function(form, entityName, propertyName, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }

            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;

            var tests = entryDef.validate;

            var oInput = new sap.m.Input(this.getView().createId(entityName + "_" + propertyName), {
                value: "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    controller.setRecordChanged();
                    if (oui5lib.validation.isValid(oInput.getValue(),
                                                   tests)) {
                        oui5lib.ui.setControlValueState(this,
                                                        propertyName, true);
                    } else {
                        oui5lib.ui.setControlValueState(this,
                                                        propertyName, false);
                    }
                }
            });
            
            if (typeof entryDef.ui5.type === "string") {
                var inputType = entryDef.ui5.type;
                if (this.availableInputTypes.indexOf(inputType) > -1) {
                    oInput.setType(entryDef.ui5.type);
                }
            }
            if (typeof entryDef.ui5.width === "string") {
                oInput.setWidth(entryDef.ui5.width);
            }
            
            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oInput);
                form.addContent(label);
            }
            
            form.addContent(oInput);
            return oInput;
        },

        addMaskInput : function(form, entityName, propertyName, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }

            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;

            var tests = entryDef.validate;

            var oInput = new sap.m.MaskInput(this.getView().createId(entityName + "_" + propertyName), {
                value: "{" + entityName + ">/" + propertyName + "}",
                mask: entryDef.ui5.mask,
                change: function() {
                    controller.setRecordChanged();
                    
                    if (oui5lib.validation.isValid(oInput.getValue(),
                                                   tests)) {
                        oui5lib.ui.setControlValueState(this,
                                                        propertyName, true);
                    } else {
                        oui5lib.ui.setControlValueState(this,
                                                        propertyName, false);
                    }
                }
            });
            if (entryDef.ui5.width) {
                oInput.setWidth(entryDef.ui5.width);
            }
            
            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oInput);
                form.addContent(label);
            }
            
            form.addContent(oInput);
            return oInput;
        },

        addSwitch : function(form, entityName, propertyName, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;
            
            var oSwitch = new sap.m.Switch(this.getView().createId(entityName + "_" + propertyName), {
                state: "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    controller.setRecordChanged();
                }
            });

            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oSwitch);
                form.addContent(label);
            }
            
            form.addContent(oSwitch);
            return oSwitch;
        },

        addCheckBox : function(form, entityName, propertyName, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;
            
            var oCheckBox = new sap.m.CheckBox(this.getView().createId(entityName + "_" + propertyName), {
                selected: "{" + entityName + ">/" + propertyName + "}",
                select: function() {
                    controller.setRecordChanged();
                }
            });
            if (entryDef.i18n.tooltip) {
                oCheckBox.setTooltip(
                    oui5lib.util.getI18nText(entryDef.i18n.tooltip)
                );
            }

            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oCheckBox);
                form.addContent(label);
            }
            
            form.addContent(oCheckBox);
            return oCheckBox;
        },

        addComboBox : function(form, entityName, propertyName,
                               onChange, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;

            // comboBox
            var oComboBox = new sap.m.ComboBox(this.getView().createId(entityName + "_" + propertyName), {
                selectedKey: "{" + entityName + ">/" + propertyName + "}",
                selectionChange: function(oEvent) {
                    controller.setRecordChanged();
                    oComboBox.setValueState(sap.ui.core.ValueState.None);
                    
                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                },
                change: function() {
                    oui5lib.ui.checkComboBox(oComboBox);
                }
            });

            if (entryDef.i18n.placeholder) {
                oComboBox.setPlaceholder(
                    oui5lib.util.getI18nText(entryDef.i18n.placeholder)
                );
            }

            // template
            var itemTemplate = this.getItemTemplate(entryDef);
            
            // sorter
            var oSorter= this.getSorter(entryDef);

            var modelName = entryDef.ui5.itemsModel;
            oComboBox.bindAggregation("items", modelName + ">/",
                                      itemTemplate, oSorter);

            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oComboBox);
                form.addContent(label);
            }
            
            form.addContent(oComboBox);
            return oComboBox;
        },

        addMultiComboBox : function(form, entityName, propertyName,
                                    onChange, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;
            
            // multiComboBox
            var oMultiComboBox = new sap.m.MultiComboBox(this.getView().createId(entityName + "_" + propertyName), {
                selectedKeys: "{" + entityName + ">/" + propertyName + "}",
                selectionChange: function(oEvent) {
                    controller.setRecordChanged();
                    
                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });

            if (entryDef.i18n.placeholder) {
                oMultiComboBox.setPlaceholder(
                    oui5lib.util.getI18nText(entryDef.i18n.placeholder)
                );
            }

            // template
            var itemTemplate = this.getItemTemplate(entryDef);

            // sorter
            var oSorter = this.getSorter(entryDef);
            
            var modelName = entryDef.ui5.itemsModel;
            oMultiComboBox.bindAggregation("items", modelName + ">/",
                                           itemTemplate, oSorter);

            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oMultiComboBox);
                form.addContent(label);
            }

            form.addContent(oMultiComboBox);
            return oMultiComboBox;
        },
        
        addSelect : function(form, entityName, propertyName,
                             onChange, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;
            
            var oSelect = new sap.m.Select(this.getView().createId(entityName + "_" + propertyName), {
                selectedKey : "{" + entityName + ">/" + propertyName + "}",
                change : function(oEvent) {
                    controller.setRecordChanged();
                    oSelect.setValueState(sap.ui.core.ValueState.None);

                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });

            var itemTemplate = this.getItemTemplate(entryDef);
            var oSorter= this.getSorter(entryDef);

            var modelName = entryDef.ui5.itemsModel;
            oSelect.bindAggregation("items", modelName + ">/",
                                   itemTemplate, oSorter);
            
            if (entryDef.i18n && entryDef.i18n.label) {
                var label = this.getLabel(entryDef, oSelect);
                form.addContent(label);
            }
            
            form.addContent(oSelect);
            return oSelect;
        },

        addDateTimePicker : function(form, entityName, propertyName, onChange) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            var enabled = true;
            if (typeof entryDef.ui5.enabled === "boolean") {
                enabled = entryDef.ui5.enabled;
            }

            var dateDisplayFormat = this.defaultDateTimeDisplayFormat;
            if (entryDef.ui5.displayFormat) {
                dateDisplayFormat = entryDef.ui5.displayFormat;
            }

            var controller = this;
            
            var dateTimePicker = new sap.m.DateTimePicker(this.getView().createId(entityName + "_" + propertyName), {
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                displayFormat: dateDisplayFormat,
                enabled: enabled,
                change: function(oEvent) {
                    controller.setRecordChanged();

                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });
            
            if (entryDef.ui5.width) {
                dateTimePicker.setWidth(entryDef.ui5.width);
            }
            
            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, dateTimePicker);
                form.addContent(label);
            }
            
            form.addContent(dateTimePicker);
            return dateTimePicker;
        },

        addTimePicker : function(form, entityName, propertyName, onChange) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            var enabled = true;
            if (typeof entryDef.ui5.enabled === "boolean") {
                enabled = entryDef.ui5.enabled;
            }

            var controller = this;

            var timeValueFormat = this.defaultTimeValueFormat;
            if (entryDef.ui5.valueFormat) {
                timeValueFormat = entryDef.ui5.valueFormat;
            }
            var timeDisplayFormat = this.defaultTimeDisplayFormat;
            if (entryDef.ui5.displayFormat) {
                timeDisplayFormat = entryDef.ui5.displayFormat;
            }
            var timePicker = new sap.m.TimePicker(this.getView().createId(entityName + "_" + propertyName), {
                valueFormat: timeValueFormat,
                displayFormat: timeDisplayFormat,
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                enabled: enabled,
                change: function(oEvent) {
                    controller.setRecordChanged();
                    timePicker.setValueState(sap.ui.core.ValueState.None);

                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });
            
            if (entryDef.ui5.width) {
                timePicker.setWidth(entryDef.ui5.width);
            }
            
            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, timePicker);
                form.addContent(label);
            }
            
            form.addContent(timePicker);
            return timePicker;
        },
        
        addDatePicker : function(form, entityName, propertyName,
                                 onChange, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;

            var dateValueFormat = this.defaultDateValueFormat;
            if (entryDef.ui5.valueFormat) {
                dateValueFormat = entryDef.ui5.valueFormat;
            }
            var dateDisplayFormat = this.defaultDateValueFormat;;
            if (entryDef.ui5.displayFormat) {
                dateDisplayFormat = entryDef.ui5.displayFormat;
            }

            var datePicker = new sap.m.DatePicker(this.getView().createId(entityName + "_" + propertyName), {
                valueFormat: dateValueFormat,
                displayFormat: dateDisplayFormat,
                dateValue : "{" + entityName + ">/" + propertyName + "}",
                enabled : enabled,
                change: function(oEvent) {
                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }

                    if (oui5lib.ui.checkDatePicker(datePicker)) {
                        controller.setRecordChanged();
                    }
                }
            });

            if (typeof entryDef.ui5.future === "boolean") {
                if (!entryDef.ui5.future) {
                    // TODO
                    var dateString = oui5lib.formatter.formatDate(new Date(), "yyyy-MM-dd") +
                        " 23:59:59";
                    var maxDate = new Date(dateString);
                    datePicker.setMaxDate(maxDate);
                }
            }
            
            if (entryDef.ui5.width) {
                datePicker.setWidth(entryDef.ui5.width);
            }
            
            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, datePicker);
                form.addContent(label);
            }
            
            form.addContent(datePicker);
            return datePicker;
        },

        addTextArea : function(form, entityName, propertyName,
                               onChange, enabled) {
            var entryDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
            if (entryDef === null) {
                return null;
            }
            
            if (typeof enabled === "undefined") {
                enabled = true;
            }
            var controller = this;
            
            var tests = entryDef.validate;
            
            var textArea = new sap.m.TextArea(this.getView().createId(entityName + "_" + propertyName), {
                value: "{" + entityName + ">/" + propertyName + "}",
                enabled: enabled,
                change: function() {
                    controller.setRecordChanged();

                    if (oui5lib.validation.isValid(textArea.getValue(),
                                                   tests)) {
                        oui5lib.ui.setControlValueState(this, propertyName, true);
                    } else {
                        oui5lib.ui.setControlValueState(this, propertyName, false);
                    }
                }
            });
            
            if (entryDef.i18n.placeholder) {
                textArea.setPlaceholder(
                    oui5lib.util.getI18nText(entryDef.i18n.placeholder)
                );
            }
            
            if (entryDef.ui5.rows) {
                textArea.setRows(entryDef.ui5.rows);
            }

            if (entryDef.i18n.label) {
                var label = this.getLabel(entryDef, textArea);
                form.addContent(label);
            }
            
            form.addContent(textArea);
            return textArea;
        },
        
        getLabel : function(entryDef, labelFor) {
            var label = new sap.m.Label({
                text : "{i18n>" + entryDef.i18n.label + "}",
                labelFor : labelFor
            });
            if (entryDef.required) {
                label.setRequired(true);
            }
            return label;
        },

        getItemTemplate: function(entryDef) {
            var modelName = entryDef.ui5.itemsModel;
            var key = entryDef.ui5.itemKey;
            var text = entryDef.ui5.itemText;
            
            // language dependent text
            if (text.match(/.*_$/)) {
                text = text + oui5lib.configuration.getCurrentLanguage();
            }
            
            var itemTemplate = new sap.ui.core.Item({
                key: "{" + modelName + ">" + key + "}",
                text: "{" + modelName + ">" + text + "}"
            });
            return itemTemplate;
        },

        getSorter: function(entryDef) {
            var oSorter= [];
            if (entryDef.ui5.sortBy) {
                var sortBy = entryDef.ui5.sortBy;
                if (sortBy.match(/.*_$/)) {
                    sortBy += oui5lib.configuration.getCurrentLanguage();
                }
                // ascending
                oSorter.push(new sap.ui.model.Sorter(sortBy, false));
            }
            return oSorter;
        }
    });
    return FormController;
});
