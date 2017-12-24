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
        defaultDateTimeValueFormat: "yyyy-MM-dd HH:mm:ss",
        
        defaultDateDisplayFormat: "short",
        defaultDateValueFormat: "yyyy-MM-dd",

        defaultTimeDisplayFormat: "HH:mm",
        defaultTimeValueFormat: "HH:mm",

        // default: Text
        _availableInputTypes: ["Email", "Number", "Password", "Tel", "Text", "Url"],
        
        _recordChanged: false,

        /**
         * Mark the record changed.
         * @memberof oui5lib.controller.FormController
         * @public
         */
        setRecordChanged: function() {
            oui5lib.logger.debug("record changed");
            this._recordChanged = true;
        },
        
        /**
         * Reset the record changed status to false (not changed).
         * @memberof oui5lib.controller.FormController
         * @public
         */
        resetRecordChanged: function() {
            this._recordChanged = false;
        },
        
        /**
         * Was the record changed?
         * @memberOf oui5lib.controller.FormController
         * @public
         * @returns {boolean} 'true' if changed, 'false' is unchanged.
         */
        wasRecordChanged: function() {
            return this._recordChanged;
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



        
        addInput: function(form, entityName, propertyName, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var controlId = this.getControlId(entityName, propertyName);
            var input = new sap.m.Input(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}"
            });
            this.attachChange(input, controlDef.validate, this);
            this.setValueStateText(controlDef, propertyName, input);
            this.setCommons(controlDef, input);

            if (typeof controlDef.ui5.type === "string") {
                var inputType = controlDef.ui5.type;
                if (this._availableInputTypes.indexOf(inputType) > -1) {
                    input.setType(inputType);
                }
            }
            
            var label = this.getLabel(addLabel, controlDef, input);
            this.addToForm(form, label, input);
            return input;
        },

        addMaskInput : function(form, entityName, propertyName, addLabel) {
            // TODO add rules
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }
            
            var controlId = this.getControlId(entityName, propertyName);
            var input = new sap.m.MaskInput(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}",
                mask: controlDef.ui5.mask
            });
            this.attachChange(input, controlDef.validate, this);
            this.setCommons(controlDef, input);

            var label = this.getLabel(addLabel, controlDef, input);
            this.addToForm(form, label, input);
            return input;
        },

        addTextArea : function(form, entityName, propertyName, onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var controlId = this.getControlId(entityName, propertyName);
            var textArea = new sap.m.TextArea(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}",
                growing: true
            });
            this.attachChange(textArea, controlDef.validate, this);
            this.setValueStateText(controlDef, propertyName, textArea);
            this.setCommons(controlDef, textArea);

            if (controlDef.ui5.rows) {
                textArea.setRows(controlDef.ui5.rows);
            }
            if (controlDef.ui5.cols) {
                textArea.setCols(controlDef.ui5.cols);
            }
            
            var label = this.getLabel(addLabel, controlDef, textArea);
            this.addToForm(form, label, textArea);
            return textArea;
        },

        attachChange: function(inputBase, tests, controller) {
            inputBase.attachChange(function() {
                controller.setRecordChanged();
                if (oui5lib.validation.isValid(inputBase.getValue(), tests)) {
                    oui5lib.ui.setControlValueState(inputBase, true);
                } else {
                    oui5lib.ui.setControlValueState(inputBase, false);
                }
            });
        },

        addSwitch : function(form, entityName, propertyName, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }
            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var oSwitch = new sap.m.Switch(controlId, {
                state: "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    controller.setRecordChanged();
                }
            });
            
            var label = this.getLabel(addLabel, controlDef, oSwitch);
            this.addToForm(form, label, oSwitch);
            return oSwitch;
        },

        addCheckBox : function(form, entityName, propertyName, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }
            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var checkBox = new sap.m.CheckBox(controlId, {
                selected: "{" + entityName + ">/" + propertyName + "}",
                select: function() {
                    controller.setRecordChanged();
                }
            });
            this.setCommons(controlDef, checkBox);
            
            var label = this.getLabel(addLabel, controlDef, checkBox);
            this.addToForm(form, label, checkBox);
            return checkBox;
        },

        
        addComboBox : function(form, entityName, propertyName,
                               onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var comboBox = new sap.m.ComboBox(controlId, {
                selectedKey: "{" + entityName + ">/" + propertyName + "}",
                selectionChange: function(oEvent) {
                    comboBox.setValueState("None");
                    
                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                },
                change: function() {
                    controller.setRecordChanged();
                    // TODO make dependent upon parameter
                    oui5lib.ui.checkComboBox(comboBox);
                }
            });
            this.setValueStateText(controlDef, propertyName, comboBox);
            this.bindItemTemplate(controlDef, comboBox);
            this.setCommons(controlDef, comboBox);

            var label = this.getLabel(addLabel, controlDef, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },

        addMultiComboBox : function(form, entityName, propertyName,
                                    onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var multiComboBox = new sap.m.MultiComboBox(controlId, {
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
            this.setValueStateText(controlDef, propertyName, multiComboBox);
            this.bindItemTemplate(controlDef, multiComboBox);
            this.setCommons(controlDef, multiComboBox);

            var label = this.getLabel(addLabel, controlDef, multiComboBox);
            this.addToForm(form, label, multiComboBox);
            return multiComboBox;
        },
        
        addSelect : function(form, entityName, propertyName,
                             onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var select = new sap.m.Select(controlId, {
                selectedKey : "{" + entityName + ">/" + propertyName + "}",
                forceSelection: false,
                change : function(oEvent) {
                    controller.setRecordChanged();
                    select.setValueState("None");

                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });
            this.setValueStateText(controlDef, propertyName, select);
            this.bindItemTemplate(controlDef, select);
            this.setCommons(controlDef, select);

            // textAlign, autoAdjustWidth
            
            var label = this.getLabel(addLabel, controlDef, select);
            this.addToForm(form, label, select);
            return select;
        },

        bindItemTemplate: function(controlDef, control) {
            var itemTemplate = this.getItemTemplate(controlDef);
            var oSorter= this.getSorter(controlDef);

            var modelName = controlDef.ui5.itemsModel;
            control.bindAggregation("items", modelName + ">/", itemTemplate, oSorter);
        },
        getItemTemplate: function(controlDef) {
            var modelName = controlDef.ui5.itemsModel;
            var key = controlDef.ui5.itemKey;
            var text = controlDef.ui5.itemText;
            
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
        getSorter: function(controlDef) {
            var oSorter= [];
            if (controlDef.ui5.sortBy) {
                var sortBy = controlDef.ui5.sortBy;
                if (sortBy.match(/.*_$/)) {
                    sortBy += oui5lib.configuration.getCurrentLanguage();
                }
                // ascending
                oSorter.push(new sap.ui.model.Sorter(sortBy, false));
            }
            return oSorter;
        },



        addDateTimePicker: function(form, entityName, propertyName,
                                    onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }
            
            var dateDisplayFormat = this.defaultDateTimeDisplayFormat;
            if (controlDef.ui5.displayFormat) {
                dateDisplayFormat = controlDef.ui5.displayFormat;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var dateTimePicker = new sap.m.DateTimePicker(controlId, {
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                displayFormat: dateDisplayFormat,
                change: function(oEvent) {
                    dateTimePicker.setValueState("None");
                    controller.setRecordChanged();

                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });
            this.setValueStateText(controlDef, propertyName, dateTimePicker);
            this.setCommons(controlDef, dateTimePicker);

            var label = this.getLabel(addLabel, controlDef, dateTimePicker);
            this.addToForm(form, label, dateTimePicker);
            return dateTimePicker;
        },

        addTimePicker : function(form, entityName, propertyName,
                                 onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }


            var timeValueFormat = this.defaultTimeValueFormat;
            if (controlDef.ui5.valueFormat) {
                timeValueFormat = controlDef.ui5.valueFormat;
            }
            var timeDisplayFormat = this.defaultTimeDisplayFormat;
            if (controlDef.ui5.displayFormat) {
                timeDisplayFormat = controlDef.ui5.displayFormat;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var timePicker = new sap.m.TimePicker(controlId, {
                valueFormat: timeValueFormat,
                displayFormat: timeDisplayFormat,
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                change: function(oEvent) {
                    controller.setRecordChanged();
                    timePicker.setValueState("None");

                    if (typeof onChange === "object") {
                        var c = onChange.controller;
                        var f = onChange.function;
                        f(oEvent, c);
                    }
                }
            });
            this.setValueStateText(controlDef, propertyName, timePicker);
            this.setCommons(controlDef, timePicker);

            var label = this.getLabel(addLabel, controlDef, timePicker);
            this.addToForm(form, label, timePicker);
            return timePicker;
        },
        
        addDatePicker : function(form, entityName, propertyName,
                                 onChange, addLabel) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var dateValueFormat = this.defaultDateValueFormat;
            if (controlDef.ui5.valueFormat) {
                dateValueFormat = controlDef.ui5.valueFormat;
            }
            var dateDisplayFormat = this.defaultDateValueFormat;
            if (controlDef.ui5.displayFormat) {
                dateDisplayFormat = controlDef.ui5.displayFormat;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var datePicker = new sap.m.DatePicker(controlId, {
                valueFormat: dateValueFormat,
                displayFormat: dateDisplayFormat,
                dateValue : "{" + entityName + ">/" + propertyName + "}",
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
            this.setValueStateText(controlDef, propertyName, datePicker);
            this.setCommons(controlDef, datePicker);

            if (typeof controlDef.ui5.future === "boolean") {
                if (!controlDef.ui5.future) {
                    // TODO
                    var dateString = oui5lib.formatter.formatDate(
                        new Date(), "yyyy-MM-dd") + " 23:59:59";
                    var maxDate = new Date(dateString);
                    datePicker.setMaxDate(maxDate);
                }
            }
            
            
            var label = this.getLabel(addLabel, controlDef, datePicker);
            this.addToForm(form, label, datePicker);
            return datePicker;
        },


        
        getControlDef: function(entityName, propertyName) {
            return oui5lib.mapping.getPropertyDefinition(entityName,
                                                         propertyName);
        },
        getControlId: function(entityName, propertyName) {
            return this.getView().createId(entityName + "_" + propertyName);
        },
        setCommons: function(controlDef, element) {
            if (typeof controlDef.i18n.tooltip === "string") {
                if (typeof element.setTooltip === "function") {
                    element.setTooltip(
                        oui5lib.util.getI18nText(controlDef.i18n.tooltip)
                    );
                }
            }
            if (typeof controlDef.i18n.placeholder === "string") {
                if (typeof element.setPlaceholder === "function") {
                    element.setPlaceholder(
                        oui5lib.util.getI18nText(controlDef.i18n.placeholder)
                    );
                }
            }
            if (typeof controlDef.ui5.width === "string") {
                if (typeof element.setWidth === "function") {
                    element.setWidth(controlDef.ui5.width);
                }
            }

        },
        setValueStateText: function(controlDef, propertyName, control) {
            var errorTextKey = "";
            if (typeof controlDef.i18n.errorText === "string") {
                errorTextKey = controlDef.i18n.errorText;
            } else {
                errorTextKey = "validation." + propertyName + ".valueText";
            }
            control.setValueStateText(
                oui5lib.util.getI18nText(errorTextKey)
            );
        },
        getLabel : function(addLabel, controlDef, labelFor) {
            if (typeof addLabel !== "boolean" || addLabel) {
                if (controlDef.i18n.label) {
                    var label = new sap.m.Label({
                        text : "{i18n>" + controlDef.i18n.label + "}",
                        labelFor : labelFor
                    });
                    if (controlDef.required) {
                        label.setRequired(true);
                    }
                    return label;
                }
            }
            return null;
        },


        
        addToForm: function(formControl, label, formElement) {
            if (formControl === null) {
                return;
            }

            if (typeof formControl.addContent === "function") {
                if (label !== null) {
                    formControl.addContent(label);
                }
                formControl.addContent(formElement);
            }
            
            if (formControl instanceof sap.ui.layout.form.FormContainer) {
                var oFormElement = new sap.ui.layout.form.FormElement();
                if (label !== null) {
                    oFormElement.setLabel(label);
                }
                oFormElement.addField(formElement);
                formControl.addFormElement(oFormElement);
            }
        },
        addFormElement: function(formContainer, entityName, propertyName) {
            var input = this.getInput(entityName, propertyName);

            var formElements = formContainer.getFormElements();
            var formField = formElements[formElements.length - 1];
            formField.addField(input);
        },
        getInput: function(entityName, propertyName, addLabel) {
            return this.addInput(null, entityName, propertyName, addLabel);
        }
    });
    return FormController;
});
