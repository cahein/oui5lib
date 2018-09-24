#!/usr/bin/env ruby
$LOAD_PATH << '.'

require 'json'
require 'ContentWriter'

puts "What is the component name? "
uinput = gets
namespace = uinput.chomp

oui5lib_configfile = File.join(__dir__, namespace, "webapp/oui5lib.json")

if File.exists? oui5lib_configfile
  file = File.read(oui5lib_configfile);
  configData = JSON.parse(file)
  mapping_directory = configData["mappingDirectory"]
end

puts "What is the mapping name? "
uinput = gets
entity_name = uinput.chomp

mapping_file = File.join(__dir__, namespace, "webapp", mapping_directory, entity_name + ".json")

if File.exists? mapping_file
  file = File.read(mapping_file);
  mapping = JSON.parse(file)

  puts "You want to use a SimpleForm (0) or a Form (1)? "
  uinput = gets
  form_type = uinput.chomp
  if form_type == "0"
    form_type = "simpleForm"
  else
    form_type = "form"
  end

  cw = ContentWriter.new(namespace, namespace)
  cw.generate_form(entity_name, mapping, form_type)

  route_name = entity_name

  # add route/target to manifest
  manifest_path = File.join(__dir__, namespace, "webapp", "manifest.json")
  manifest_file =  File.open(manifest_path, "r")

  manifest = JSON.parse(manifest_file.read)
  if manifest["sap.ui5"]["routing"]["routes"]
    add_route = true

    routes = manifest["sap.ui5"]["routing"]["routes"]
    routes.each do | route |
      if route["pattern"] == entity_name
        add_route = false
      end
    end
    if add_route
      routes << {
        "pattern" => entity_name,
        "name" => entity_name,
        "target" => entity_name + "Form"
      }
    end
  end

  if manifest["sap.ui5"]["routing"]["targets"]
    targets = manifest["sap.ui5"]["routing"]["targets"]
    targets[entity_name + "Form"] = {
      "viewName" => entity_name
    }
  end

  manifest_file =  File.open(manifest_path, "w")
  manifest_file.print JSON.pretty_generate(manifest)

  # add tile to config
  config_path = File.join(__dir__, namespace, "webapp", "config.json")
  config_file =  File.open(config_path, "r")

  config = JSON.parse(config_file.read)
  puts config["entryPoints"]
  if config["entryPoints"]
    add_entryPoint = true

    entryPoints = config["entryPoints"]
    entryPoints.each do | entryPoint |
      if entryPoint["routeName"] == entity_name
        add_entryPoint = false
      end
    end
    if add_entryPoint
      entryPoints << {
        "header" => "{i18n>tiles.#{entity_name}.header}",
        "footer" => "{i18n>tiles.#{entity_name}.footer}",
        "tooltip" => "{i18n>#{entity_name}.tooltip}",
        "icon" => "sap-icon://form",
        "iconText" => "{i18n>tiles.#{entity_name}.iconText}",
        "routeName" => "#{entity_name}"
      }
      config_file =  File.open(config_path, "w")
      config_file.print JSON.pretty_generate(config)
    end
  end

end
