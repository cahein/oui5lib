# OpenUI5 library

The oui5lib project aims to provide tools to simplify and speed up development with OpenUI5. It is partly just a collection of useful functions for UI5 development, but also provides extensions to handle requests, validate input and construct form controls.

The project uses grunt for various project related tasks. Install required node packages with

    npm install

## Examples

There are examples to showcase the library. The examples need to be prepared by running

    grunt prepare-examples

Furthermore, to run the examples, link or copy the 'resources' folder from the OpenUI5 SDK to the ComponentTemplate and FormPage example folders. 

* The ComponentTemplate example is just a basic component without any particular functionality. There is also generator code in the 'templates' subfolder to quickly start a new application.

* The FormPage example shows the use of more advanced features of oui5lib, like form control generation and input validation based upon domain entity mappings.

* The DomainObjects example shows an implementation and use of domain entity collections and item objects. There is no UI. Run the SpecRunner.html in the 'test' folder instead.


## Documentation

Generate documentation with
    
    grunt gendoc

Then load doc/index.html

## Distribution

To generate a minified JavaScript file ('oui5lib.min.js') and a 'oui5lib' folder, use

    grunt dist

To add it to your component, copy the files of the 'dist' folder into your webapp root. Customize the 'oui5lib.json'. Rename one of the oui5lib files ('oui5lib.min.js' or 'oui5lib.concat.js') to 'oui5lib.js' and require it with

    jQuery.sap.require("oui5lib");

## Tests

For tests, please use the SpecRunner.html files in the 'webapp/test' and 'examples/domainObjects/test' folders.


## TODO

* Allow this to be a UI5 Core library.

* Handle dependency loading with sap.ui.define.

* Add tests for UI elements, especially the FormController.
