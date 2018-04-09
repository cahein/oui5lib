# OpenUI5 library: Template generator

The generator is written in Ruby. To use it, you need to have [Ruby](https://www.ruby-lang.org/) installed and also the [uglifier](https://github.com/lautis/uglifier) gem.

## Generate a base component

To start the generator, open a terminal, move to the 'templates' folder and run the following command:

    ruby generate.rb
    
The script will first ask for a component name. This name is used to create a folder inside the 'templates' folder. It is also used as value for the 'name' property of the node 'package.json', as UIComponent 'name' and prefix for the component ID, as root namespace of the custom library, among others. At this time only letters are allowed. The script will exit if a folder with the given name already exists.

After the component was generated, change into its folder. Inside the component folder you find a 'package.json' with development dependencies. Install these dependencies with

    npm install
    
After this, you have a few grunt tasks available. Get an overview of available tasks by executing

    grunt

Build a distribution package with

    grunt dist

For linting the JavaScript code [eslint](https://eslint.org/) is used. Please replace or edit the provided '.eslintrc.json' according to your conventions.

    grunt lint

You won't be able to run the application without the UI5 resources. 
