sap.ui.define([
    "oui5lib/controller/BaseController"
], function(oController) {
    "use strict";

    const mapping = oui5lib.mapping;
    
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


        addInput: function(form, entityName, propertyPath, addLabel) {
            const input = this.getInput(entityName, propertyPath);
            if (input === null) {
                return null;
            }
            const attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                                 propertyPath);
            
            const label = this.getLabel(addLabel, attributeSpec, input);
            this.addToForm(form, label, input);
            return input;
        },
        getInput: function(entityName, propertyPath) {
            const attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                                 propertyPath);
            if (attributeSpec === null) {
                return null;
            }
            const controlId = this.getControlId(entityName, propertyPath);
            let input = new sap.m.Input(controlId, {
                value: "{" + entityName + ">/" + propertyPath + "}"
            });
            this.attachChange(input, attributeSpec.validate);
            this.setCommons(attributeSpec, input);

            if (typeof attributeSpec.ui5.type === "string") {
                let inputType = attributeSpec.ui5.type;
                if (this._availableInputTypes.indexOf(inputType) > -1) {
                    input.setType(inputType);
                }
            }
            return input;
        },

        addMaskInput: function(form, entityName, propertyPath, addLabel) {
            let input = this.getMaskInput(entityName, propertyPath);
            if (input === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, input);
            this.addToForm(form, label, input);
            return input;
        },
        getMaskInput : function(entityName, propertyPath) {
            // TODO add rules
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }
            
            let controlId = this.getControlId(entityName, propertyPath);
            let input = new sap.m.MaskInput(controlId, {
                value: "{" + entityName + ">/" + propertyPath + "}",
                mask: attributeSpec.ui5.mask
            });
            this.attachChange(input, attributeSpec.validate);
            this.setCommons(attributeSpec, input);
            return input;
        },
       
        addTextArea: function(form, entityName, propertyPath, addLabel) {
            let textArea = this.getTextArea(entityName, propertyPath);
            if (textArea === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, textArea);
            this.addToForm(form, label, textArea);
            return textArea;
        },
        getTextArea : function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controlId = this.getControlId(entityName, propertyPath);
            let textArea = new sap.m.TextArea(controlId, {
                value: "{" + entityName + ">/" + propertyPath + "}"
            });
            this.attachChange(textArea, attributeSpec.validate);
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



        addSwitch: function(form, entityName, propertyPath, addLabel) {
            let oSwitch = this.getSwitch(entityName, propertyPath);
            if (oSwitch === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, oSwitch);
            this.addToForm(form, label, oSwitch);
            return oSwitch;
        },
        getSwitch: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }
            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let oSwitch = new sap.m.Switch(controlId, {
                state: "{" + entityName + ">/" + propertyPath + "}",
                change: function() {
                    controller.setRecordChanged();
                }
            });
            this.setCommons(attributeSpec, oSwitch);
            return oSwitch;
        },

        addCheckBox: function(form, entityName, propertyPath, addLabel) {
            let checkBox = this.getCheckBox(entityName, propertyPath);
            if (checkBox === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, checkBox);
            this.addToForm(form, label, checkBox);
            return checkBox;
        },
        getCheckBox: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }
            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let checkBox = new sap.m.CheckBox(controlId, {
                selected: "{" + entityName + ">/" + propertyPath + "}",
                select: function() {
                    controller.setRecordChanged();
                }
            });
            this.setCommons(attributeSpec, checkBox);

            if (typeof attributeSpec.ui5.text === "string") {
                checkBox.setText(
                    oui5lib.util.getI18nText(attributeSpec.ui5.text)
                );
            }
            
            return checkBox;
        },



        
        addComboBox: function(form, entityName, propertyPath, addLabel) {
            let comboBox = this.getComboBox(entityName, propertyPath);
            if (comboBox === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },
        getComboBox: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let comboBox = new sap.m.ComboBox(controlId, {
                selectedKey: "{" + entityName + ">/" + propertyPath + "}",
                selectionChange: function() {
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
            this.setCommons(attributeSpec, comboBox);

            this.bindItemTemplate(attributeSpec, comboBox);

            return comboBox;
        },

        addMultiComboBox: function(form, entityName, propertyPath, addLabel) {
            let comboBox = this.getMultiComboBox(entityName, propertyPath);
            if (comboBox === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, comboBox);
            this.addToForm(form, label, comboBox);
            return comboBox;
        },
        getMultiComboBox: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let multiComboBox = new sap.m.MultiComboBox(controlId, {
                selectedKeys: "{" + entityName + ">/" + propertyPath + "}",
                selectionChange: function() {
                    controller.setRecordChanged();
                }
            });
            this.setCommons(attributeSpec, multiComboBox);

            this.bindItemTemplate(attributeSpec, multiComboBox);
            
            return multiComboBox;
        },

        addSelect: function(form, entityName, propertyPath, addLabel) {
            let select = this.getSelect(entityName, propertyPath);
            if (select === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, select);
            this.addToForm(form, label, select);
            return select;
        },
        getSelect: function(entityName, propertyPath) {
            const attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                                 propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let select = new sap.m.Select(controlId, {
                selectedKey : "{" + entityName + ">/" + propertyPath + "}",
                forceSelection: false,
                change: function() {
                    controller.setRecordChanged();
                    select.setValueState("None");
                }
            });
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
            let text = attributeSpec.ui5.itemText;
            
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

        addDateTimePicker: function(form, entityName, propertyPath, addLabel) {
            let dateTimePicker = this.getDateTimePicker(entityName, propertyPath);
            if (dateTimePicker === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, dateTimePicker);
            this.addToForm(form, label, dateTimePicker);
            return dateTimePicker;
        },
        getDateTimePicker: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let dateTimePicker = new sap.m.DateTimePicker(controlId, {
                dateValue: "{" + entityName + ">/" + propertyPath + "}",
                change: function() {
                    if (oui5lib.ui.checkDatePicker(dateTimePicker)) {
                        dateTimePicker.setValueState("None");
                        controller.setRecordChanged();
                    }
                }
            });
            this.setCommons(attributeSpec, dateTimePicker);
            this.setDateFormats(attributeSpec, dateTimePicker, "dateTime");
            this.setDateConstraints(attributeSpec, dateTimePicker);

            return dateTimePicker;
        },
        
        addDatePicker: function(form, entityName, propertyPath, addLabel) {
            let datePicker = this.getDatePicker(entityName, propertyPath);
            if (datePicker === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, datePicker);
            this.addToForm(form, label, datePicker);
            return datePicker;
        },
        getDatePicker: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let datePicker = new sap.m.DatePicker(controlId, {
                dateValue : "{" + entityName + ">/" + propertyPath + "}",
                change: function() {
                    if (oui5lib.ui.checkDatePicker(datePicker)) {
                        datePicker.setValueState("None");
                        controller.setRecordChanged();
                    }
                }
            });
            this.setCommons(attributeSpec, datePicker);
            this.setDateFormats(attributeSpec, datePicker, "date");
            this.setDateConstraints(attributeSpec, datePicker);
            
            return datePicker;
        },

        addTimePicker: function(form, entityName, propertyPath, addLabel) {
            let timePicker = this.getTimePicker(entityName, propertyPath);
            if (timePicker === null) {
                return null;
            }
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            let label = this.getLabel(addLabel, attributeSpec, timePicker);
            this.addToForm(form, label, timePicker);
            return timePicker;
        },
        getTimePicker: function(entityName, propertyPath) {
            let attributeSpec = mapping.getEntityAttributeSpec(entityName,
                                                               propertyPath);
            if (attributeSpec === null) {
                return null;
            }

            let controller = this;
            let controlId = this.getControlId(entityName, propertyPath);
            let timePicker = new sap.m.TimePicker(controlId, {
                dateValue: "{" + entityName + ">/" + propertyPath + "}",
                change: function() {
                    controller.setRecordChanged();
                    timePicker.setValueState("None");
                }
            });
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
        setDateConstraints: function(attributeSpec, control) {
            if (typeof attributeSpec.ui5.future === "boolean") {
                let currentDate = new Date();
                if (attributeSpec.ui5.future) {
                    if (control instanceof sap.m.DatePicker) {
                        currentDate.setHours(0);
                        currentDate.setMinutes(0);
                        currentDate.setSeconds(0);
                    }
                    control.setMinDate(currentDate);
                } else {
                    if (control instanceof sap.m.DatePicker) {
                        currentDate.setHours(23);
                        currentDate.setMinutes(59);
                        currentDate.setSeconds(59);
                    }
                    control.setMaxDate(currentDate);
                }
            }
        },
        
        getControlId: function(entityName, propertyPath) {
            return this.getView().createId(entityName + "_" + propertyPath);
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
            // InputBase, Select, CheckBox
            if (typeof attributeSpec.ui5.width === "string") {
                let width = attributeSpec.ui5.width;
                if (sap.ui.core.CSSSize.isValid(width) &&
                    typeof element.setWidth === "function") {
                    element.setWidth(width);
                }
            }
            // InputBase, Select
            if (typeof attributeSpec.i18n.invalid === "string") {
                if (typeof element.setValueStateText === "function") {
                    element.setValueStateText(
                        oui5lib.util.getI18nText(attributeSpec.i18n.invalid)
                    );
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
