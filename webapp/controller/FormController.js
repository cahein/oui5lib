sap.ui.define([
    "oui5lib/controller/BaseController"
], function(oController) {
    "use strict";

    const mapping = oui5lib.mapping;
    const configuration = oui5lib.configuration;
    
    /**
     * Use the FormController if you have a view with a Form. 
     * @mixin oui5lib.controller.FormController
     */
    const FormController = oController.extend("oui5lib.controller.FormController", {
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
            const input = this.getInput(entityName, propertyName);
            if (input === null) {
                return null;
            }
            const attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                                 propertyName);
            
            const label = this.getLabel(addLabel, attributeSpec, input);
            this.addToForm(form, label, input);
            return input;
        },
        getInput: function(entityName, propertyName) {
            const attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                                 propertyName);
            if (attributeSpec === null) {
                return null;
            }
            const controlId = this.getControlId(entityName, propertyName);
            let input = new sap.m.Input(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}"
            });
            this.attachChange(input, attributeSpec.validate);
            this.setValueStateText(attributeSpec, input);
            this.setCommons(attributeSpec, input);

            if (typeof attributeSpec.ui5.type === "string") {
                let inputType = attributeSpec.ui5.type;
                if (this._availableInputTypes.indexOf(inputType) > -1) {
                    input.setType(inputType);
                }
            }
            return input;
        },

        addMaskInput: function(form, entityName, propertyName, addLabel) {
            let input = this.getMaskInput(entityName, propertyName);
            if (input === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, input);
            this.addToForm(form, label, input);
            return input;
        },
        getMaskInput : function(entityName, propertyName) {
            // TODO add rules
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }
            
            let controlId = this.getControlId(entityName, propertyName);
            let input = new sap.m.MaskInput(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}",
                mask: attributeSpec.ui5.mask
            });
            this.attachChange(input, attributeSpec.validate);
            this.setValueStateText(attributeSpec, input);
            this.setCommons(attributeSpec, input);
            return input;
        },
       
        addTextArea: function(form, entityName, propertyName, addLabel) {
            let textArea = this.getTextArea(entityName, propertyName);
            if (textArea === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, textArea);
            this.addToForm(form, label, textArea);
            return textArea;
        },
        getTextArea : function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controlId = this.getControlId(entityName, propertyName);
            let textArea = new sap.m.TextArea(controlId, {
                value: "{" + entityName + ">/" + propertyName + "}"
            });
            this.attachChange(textArea, attributeSpec.validate);
            this.setValueStateText(attributeSpec, textArea);
            this.setCommons(attributeSpec, textArea);
            
            if (typeof attributeSpec.ui5.growing === "boolean") {
                textArea.setGrowing(attributeSpec.ui5.growing);
            } else {
                textArea.setGrowing(true);
            }
            if (typeof attributeSpec.ui5.cols === "number") {
                textArea.setCols(attributeSpec.ui5.cols);
            }
            if (typeof attributeSpec.ui5.rows === "number") {
                textArea.setRows(attributeSpec.ui5.rows);
            }
            return textArea;
        },
        
        /**
         * Attach function to the InputBase change event.
         * @memberof oui5lib.controller.FormController
         * @public
         * @param {sap.m.InputBase} inputBase Some Element extending the InputBase.
         * @param {Array} constraints An array of strings used for validation. See {@link oui5lib.validation.isValid}
         */
        attachChange: function(inputBase, constraints) {
            let controller = this;
            inputBase.attachChange(function() {
                controller.setRecordChanged();
                if (oui5lib.validation.isValid(inputBase.getValue(), constraints)) {
                    oui5lib.ui.setControlValueState(inputBase, true);
                } else {
                    oui5lib.ui.setControlValueState(inputBase, false);
                    this.focus();
                }
            });
        },



        addSwitch: function(form, entityName, propertyName, addLabel) {
            let oSwitch = this.getSwitch(entityName, propertyName);
            if (oSwitch === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, oSwitch);
            this.addToForm(form, label, oSwitch);
            return oSwitch;
        },
        getSwitch: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }
            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let oSwitch = new sap.m.Switch(controlId, {
                state: "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    controller.setRecordChanged();
                }
            });
            this.setCommons(attributeSpec, oSwitch);
            return oSwitch;
        },

        addCheckBox: function(form, entityName, propertyName, addLabel) {
            let checkBox = this.getCheckBox(entityName, propertyName);
            if (checkBox === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, checkBox);
            this.addToForm(form, label, checkBox);
            return checkBox;
        },
        getCheckBox: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }
            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let checkBox = new sap.m.CheckBox(controlId, {
                selected: "{" + entityName + ">/" + propertyName + "}",
                select: function() {
                    controller.setRecordChanged();
                }
            });
            this.setCommons(attributeSpec, checkBox);
            return checkBox;
        },



        
        addComboBox: function(form, entityName, propertyName, addLabel) {
            let comboBox = this.getComboBox(entityName, propertyName);
            if (comboBox === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },
        getComboBox: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let comboBox = new sap.m.ComboBox(controlId, {
                selectedKey: "{" + entityName + ">/" + propertyName + "}",
                selectionChange: function(oEvent) {
                    comboBox.setValueState("None");
                },
                change: function() {
                    controller.setRecordChanged();
                    let onlyItems = attributeSpec.ui5.onlyItems;
                    if (typeof onlyItems === "boolean" && onlyItems) {
                        oui5lib.ui.checkComboBox(comboBox);
                    }
                }
            });
            this.setValueStateText(attributeSpec, comboBox);
            this.setCommons(attributeSpec, comboBox);

            this.bindItemTemplate(attributeSpec, comboBox);

            return comboBox;
        },

        addMultiComboBox: function(form, entityName, propertyName, addLabel) {
            let comboBox = this.getMultiComboBox(entityName, propertyName);
            if (comboBox === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },
        getMultiComboBox: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let multiComboBox = new sap.m.MultiComboBox(controlId, {
                selectedKeys: "{" + entityName + ">/" + propertyName + "}",
                selectionChange: function(oEvent) {
                    controller.setRecordChanged();
                }
            });
            this.setValueStateText(attributeSpec, multiComboBox);
            this.setCommons(attributeSpec, multiComboBox);

            this.bindItemTemplate(attributeSpec, multiComboBox);
            
            return multiComboBox;
        },

        addSelect: function(form, entityName, propertyName, addLabel) {
            let select = this.getSelect(entityName, propertyName);
            if (select === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, select);
            this.addToForm(form, label, select);
            return select;
        },
        getSelect: function(entityName, propertyName) {
            const attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                                 propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let select = new sap.m.Select(controlId, {
                selectedKey : "{" + entityName + ">/" + propertyName + "}",
                forceSelection: false,
                change: function(oEvent) {
                    controller.setRecordChanged();
                    select.setValueState("None");
                }
            });
            this.setValueStateText(attributeSpec, select);
            this.setCommons(attributeSpec, select);

            this.bindItemTemplate(attributeSpec, select);

            return select;
        },

        bindItemTemplate: function(attributeSpec, control) {
            const modelName = attributeSpec.ui5.itemsModel;
            const itemTemplate = this.getItemTemplate(attributeSpec);
            const oSorter= this.getSorter(attributeSpec);

            control.bindAggregation("items", modelName + ">/", itemTemplate, oSorter);
        },
        getItemTemplate: function(attributeSpec) {
            const modelName = attributeSpec.ui5.itemsModel;
            const key = attributeSpec.ui5.itemKey;
            const text = attributeSpec.ui5.itemText;
            
            // language dependent text
            if (text.match(/.*_$/)) {
                text = text + oui5lib.configuration.getCurrentLanguage();
            }
            
            let itemTemplate = new sap.ui.core.Item({
                key: "{" + modelName + ">" + key + "}",
                text: "{" + modelName + ">" + text + "}"
            });
            return itemTemplate;
        },
        getSorter: function(attributeSpec) {
            let oSorter= [];
            if (attributeSpec.ui5.sortBy) {
                let sortBy = attributeSpec.ui5.sortBy;
                if (sortBy.match(/.*_$/)) {
                    sortBy += oui5lib.configuration.getCurrentLanguage();
                }
                let sortOrder;
                if (typeof attributeSpec.ui5.sortOrder === "string") {
                    switch(attributeSpec.ui5.sortOrder) {
                    case "ASC":
                        sortOrder = false;
                        break;
                    case "DESC":
                        sortOrder = true;
                        break;
                    default:
                        sortOrder = false;
                    }                    
                }
                oSorter.push(new sap.ui.model.Sorter(sortBy, sortOrder));
            }
            return oSorter;
        },

        addDateTimePicker: function(form, entityName, propertyName, addLabel) {
            let dateTimePicker = this.getDateTimePicker(entityName, propertyName);
            if (dateTimePicker === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, dateTimePicker);
            this.addToForm(form, label, dateTimePicker);
            return dateTimePicker;
        },
        getDateTimePicker: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let dateTimePicker = new sap.m.DateTimePicker(controlId, {
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    dateTimePicker.setValueState("None");
                    controller.setRecordChanged();
                }
            });
            this.setValueStateText(attributeSpec, dateTimePicker);
            this.setCommons(attributeSpec, dateTimePicker);
            this.setDateFormats(attributeSpec, dateTimePicker, "dateTime");

            return dateTimePicker;
        },
        
        addDatePicker: function(form, entityName, propertyName, addLabel) {
            let datePicker = this.getDatePicker(entityName, propertyName);
            if (datePicker === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, datePicker);
            this.addToForm(form, label, datePicker);
            return datePicker;
        },
        getDatePicker: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let datePicker = new sap.m.DatePicker(controlId, {
                dateValue : "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    if (oui5lib.ui.checkDatePicker(datePicker)) {
                        controller.setRecordChanged();
                    }
                }
            });
            this.setValueStateText(attributeSpec, datePicker);
            this.setCommons(attributeSpec, datePicker);
            this.setDateFormats(attributeSpec, datePicker, "date");

            if (typeof attributeSpec.ui5.future === "boolean") {
                let currentDate = new Date();
                if (attributeSpec.ui5.future) {
                    currentDate.setHours(0);
                    currentDate.setMinutes(0);
                    currentDate.setSeconds(0);
                    datePicker.setMinDate(currentDate);
                } else {
                    currentDate.setHours(23);
                    currentDate.setMinutes(59);
                    currentDate.setSeconds(59);
                    datePicker.setMaxDate(currentDate);
                }
            }
            return datePicker;
        },

        addTimePicker: function(form, entityName, propertyName, addLabel) {
            let timePicker = this.getTimePicker(entityName, propertyName);
            if (timePicker === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            let label = this.getLabel(addLabel, attributeSpec, timePicker);
            this.addToForm(form, label, timePicker);
            return timePicker;
        },
        getTimePicker: function(entityName, propertyName) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyName);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyName);
            let timePicker = new sap.m.TimePicker(controlId, {
                dateValue: "{" + entityName + ">/" + propertyName + "}",
                change: function() {
                    controller.setRecordChanged();
                    timePicker.setValueState("None");
                }
            });
            this.setValueStateText(attributeSpec, timePicker);
            this.setCommons(attributeSpec, timePicker);
            this.setDateFormats(attributeSpec, timePicker, "time");
            
            return timePicker;
        },

        setDateFormats: function(attributeSpec, control, type) {
            let valuePattern = oui5lib.configuration.getDateTimeValuePattern(type);
            if (attributeSpec.ui5.valueFormat) {
                valuePattern = attributeSpec.ui5.valueFormat;
            }
            control.setValueFormat(valuePattern);
            
            if (attributeSpec.ui5.displayFormat) {
                control.setDisplayFormat(attributeSpec.ui5.displayFormat);
            }
        },

        
        getControlId: function(entityName, propertyName) {
            return this.getView().createId(entityName + "_" + propertyName);
        },

        setCommons: function(attributeSpec, element) {
            // Element
            if (typeof attributeSpec.i18n.tooltip === "string") {
                if (typeof element.setTooltip === "function") {
                    element.setTooltip(
                        oui5lib.util.getI18nText(attributeSpec.i18n.tooltip)
                    );
                }
            }
            // InputBase, CheckBox, Select
            if (typeof attributeSpec.ui5.width === "string") {
                let width = attributeSpec.ui5.width;
                if (sap.ui.core.CSSSize.isValid(width) &&
                    typeof element.setWidth === "function") {
                    element.setWidth(width);
                }
            }
            // ComboBox, MultiComboBox, Select
            if (typeof attributeSpec.ui5.maxWidth === "string") {
                let maxWidth = attributeSpec.ui5.maxWidth;
                if (sap.ui.core.CSSSize.isValid(maxWidth) &&
                    typeof element.setMaxWidth === "function") {
                    element.setMaxWidth(maxWidth);
                }
            }
            // InputBase
            if (typeof attributeSpec.i18n.placeholder === "string") {
                if (typeof element.setPlaceholder === "function") {
                    element.setPlaceholder(
                        oui5lib.util.getI18nText(attributeSpec.i18n.placeholder)
                    );
                }
            }
            // Input, TextArea
            if (typeof attributeSpec.ui5.maxLength === "number") {
                if (typeof element.setMaxLength === "function") {
                    element.setMaxLength(attributeSpec.ui5.maxLength);
                }
            }
        },
        setValueStateText: function(attributeSpec, control) {
            if (typeof attributeSpec.i18n.invalid === "string") {
                control.setValueStateText(
                    oui5lib.util.getI18nText(attributeSpec.i18n.invalid)
                );
            }
        },
        getLabel: function(addLabel, attributeSpec, labelFor) {
            if (typeof addLabel !== "boolean" || addLabel) {
                if (attributeSpec.i18n.label) {
                    let label = new sap.m.Label({
                        text: "{i18n>" + attributeSpec.i18n.label + "}",
                        labelFor: labelFor
                    });
                    if (attributeSpec.required) {
                        label.setRequired(true);
                    }
                    return label;
                }
            }
            return null;
        },


        
        addToForm: function(formControl, label, element) {
            if (formControl === null) {
                return;
            }

            if (formControl instanceof sap.ui.layout.form.SimpleForm) {
                // SimpleForm
                if (label !== null) {
                    formControl.addContent(label);
                }
                formControl.addContent(element);
            }
            
            if (formControl instanceof sap.ui.layout.form.FormContainer) {
                // Form
                const oFormElement = new sap.ui.layout.form.FormElement();
                if (label !== null) {
                    oFormElement.setLabel(label);
                }
                oFormElement.addField(element);
                formControl.addFormElement(oFormElement);
            }
        },
        addToLastFormElement: function(formContainer, element) {
            let formElements = formContainer.getFormElements();
            let formField = formElements[formElements.length - 1];
            formField.addField(element);
        }
    });
    return FormController;
});
