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
            var input = this.getInput(entityName, propertyName);
            if (input === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, input);
            this.addToForm(form, label, input);
            return input;
        },
        getInput: function(entityName, propertyName) {
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
            return input;
        },

        addMaskInput: function(form, entityName, propertyName, addLabel) {
            var input = this.getMaskInput(entityName, propertyName);
            if (input === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, input);
            this.addToForm(form, label, input);
            return input;
        },
        getMaskInput : function(entityName, propertyName) {
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
            return input;
        },
       
        addTextArea: function(form, entityName, propertyName, addLabel) {
            var textArea = this.getTextArea(entityName, propertyName);
            if (textArea === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, textArea);
            this.addToForm(form, label, textArea);
            return textArea;
        },
        getTextArea : function(entityName, propertyName) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var controlId = this.getControlId(entityName, propertyName);
            var textArea = new sap.m.TextArea(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}"
            });
            this.attachChange(textArea, controlDef.validate, this);
            this.setValueStateText(controlDef, propertyName, textArea);
            this.setCommons(controlDef, textArea);
            
            if (typeof controlDef.ui5.growing === "boolean") {
                textArea.setGrowing(controlDef.ui5.growing);
            } else {
                textArea.setGrowing(true);
            }
            if (controlDef.ui5.cols) {
                textArea.setCols(controlDef.ui5.cols);
            }
            if (controlDef.ui5.rows) {
                textArea.setRows(controlDef.ui5.rows);
            }
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



        addSwitch: function(form, entityName, propertyName, addLabel) {
            var oSwitch = this.getSwitch(entityName, propertyName);
            if (oSwitch === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, oSwitch);
            this.addToForm(form, label, oSwitch);
            return oSwitch;
        },
        getSwitch : function(entityName, propertyName) {
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
            return oSwitch;
        },

        addCheckBox: function(form, entityName, propertyName, addLabel) {
            var checkBox = this.getCheckBox(entityName, propertyName);
            if (checkBox === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, checkBox);
            this.addToForm(form, label, checkBox);
            return checkBox;
        },
        getCheckBox : function(form, entityName, propertyName, addLabel) {
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
            return checkBox;
        },



        
        addComboBox: function(form, entityName, propertyName, onChange, addLabel) {
            var comboBox = this.getComboBox(entityName, propertyName, onChange);
            if (comboBox === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },
        getComboBox : function(entityName, propertyName, onChange) {
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
                        var f = onChange.function;
                        var c = onChange.controller;
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
            this.setCommons(controlDef, comboBox);

            this.bindItemTemplate(controlDef, comboBox);

            return comboBox;
        },

        addMultiComboBox: function(form, entityName, propertyName, onChange, addLabel) {
            var comboBox = this.getMultiComboBox(entityName, propertyName, onChange);
            if (comboBox === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },
        getMultiComboBox : function(entityName, propertyName, onChange) {
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
                        var f = onChange.function;
                        var c = onChange.controller;
                        f(oEvent, c);
                    }
                }
            });
            this.setValueStateText(controlDef, propertyName, multiComboBox);
            this.setCommons(controlDef, multiComboBox);

            this.bindItemTemplate(controlDef, multiComboBox);
            
            return multiComboBox;
        },

        addSelect: function(form, entityName, propertyName, onChange, addLabel) {
            var select = this.getSelect(entityName, propertyName, onChange);
            if (select === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, select);
            this.addToForm(form, label, select);
            return select;
        },
        getSelect : function(entityName, propertyName, onChange) {
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
                        var f = onChange.function;
                        var c = onChange.controller;
                        f(oEvent, c);
                    }
                }
            });
            this.setValueStateText(controlDef, propertyName, select);
            this.setCommons(controlDef, select);

            this.bindItemTemplate(controlDef, select);

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


        
        addDateTimePicker: function(form, entityName, propertyName, onChange, addLabel) {
            var dateTimePicker = this.getDateTimePicker(entityName, propertyName, onChange);
            if (dateTimePicker === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, dateTimePicker);
            this.addToForm(form, label, dateTimePicker);
            return dateTimePicker;
        },
        getDateTimePicker: function(entityName, propertyName, onChange) {
            var controlDef = this.getControlDef(entityName, propertyName);
            if (controlDef === null) {
                return null;
            }

            var dateValueFormat = this.defaultDateValueFormat;
            if (controlDef.ui5.valueFormat) {
                dateValueFormat = controlDef.ui5.displayFormat;
            }
            
            var dateDisplayFormat = this.defaultDateTimeDisplayFormat;
            if (controlDef.ui5.displayFormat) {
                dateDisplayFormat = controlDef.ui5.displayFormat;
            }

            var controller = this;
            var controlId = this.getControlId(entityName, propertyName);
            var dateTimePicker = new sap.m.DateTimePicker(controlId, {
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                valueFormat: dateValueFormat,
                displayFormat: dateDisplayFormat,
                change: function(oEvent) {
                    dateTimePicker.setValueState("None");
                    controller.setRecordChanged();

                    if (typeof onChange === "object") {
                        var f = onChange.function;
                        var c = onChange.controller;
                        f(oEvent, c);
                    }
                }
            });
            this.setValueStateText(controlDef, propertyName, dateTimePicker);
            this.setCommons(controlDef, dateTimePicker);
            return dateTimePicker;
        },
        
        addDatePicker: function(form, entityName, propertyName, onChange, addLabel) {
            var datePicker = this.getDatePicker(entityName, propertyName, onChange);
            if (datePicker === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, datePicker);
            this.addToForm(form, label, datePicker);
            return datePicker;
        },
        getDatePicker : function(entityName, propertyName, onChange) {
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
            return datePicker;
        },

        addTimePicker: function(form, entityName, propertyName, onChange, addLabel) {
            var timePicker = this.getTimePicker(entityName, propertyName, onChange);
            if (timePicker === null) {
                return null;
            }
            var controlDef = this.getControlDef(entityName, propertyName);
            var label = this.getLabel(addLabel, controlDef, timePicker);
            this.addToForm(form, label, timePicker);
            return timePicker;
        },
        getTimePicker : function(entityName, propertyName, onChange) {
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
            return timePicker;
        },


        
        getControlDef: function(entityName, propertyName) {
           var controlDef = null;
           try {
              controlDef = oui5lib.mapping.getPropertyDefinition(entityName,
                                                                 propertyName);
           } catch(e) {
              this.error(e.message);
           }
           return controlDef;
        },
        getControlId: function(entityName, propertyName) {
            return this.getView().createId(entityName + "_" + propertyName);
        },

        setCommons: function(controlDef, element) {
            // Element
            if (typeof controlDef.i18n.tooltip === "string") {
                if (typeof element.setTooltip === "function") {
                    element.setTooltip(
                        oui5lib.util.getI18nText(controlDef.i18n.tooltip)
                    );
                }
            }
            // InputBase, CheckBox, Select
            if (typeof controlDef.ui5.width === "string") {
                if (typeof element.setWidth === "function") {
                    element.setWidth(controlDef.ui5.width);
                }
            }
            // ComboBox, MultiComboBox, Select
            if (typeof controlDef.ui5.maxWidth === "string") {
                if (typeof element.setMaxWidth === "function") {
                    element.setMaxWidth(controlDef.ui5.maxWidth);
                }
            }
            // InputBase
            if (typeof controlDef.i18n.placeholder === "string") {
                if (typeof element.setPlaceholder === "function") {
                    element.setPlaceholder(
                        oui5lib.util.getI18nText(controlDef.i18n.placeholder)
                    );
                }
            }
            // Input, TextArea
            if (typeof controlDef.ui5.maxLength === "number") {
                if (typeof element.setMaxLength === "function") {
                    element.setMaxLength(controlDef.ui5.maxLength);
                }
            }
        },
        setValueStateText: function(controlDef, propertyName, control) {
            var errorTextKey = "";
            if (typeof controlDef.i18n.invalid === "string") {
                errorTextKey = controlDef.i18n.invalid;
            } else {
                errorTextKey = "validation." + propertyName + ".invalid";
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
                if (label instanceof sap.m.Label) {
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
              
        addInputToLastFormElement: function(formContainer,
                                            entityName, propertyName) {
            var input = this.getInput(entityName, propertyName);
            var formElements = formContainer.getFormElements();
            var formField = formElements[formElements.length - 1];
            formField.addField(input);
        }
    });
    return FormController;
});
