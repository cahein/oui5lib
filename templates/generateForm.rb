#!/usr/bin/env ruby
# coding: utf-8
$LOAD_PATH << '.'

require 'json'
require 'ContentWriter'

def add_route(routes, entity_name)
  routes.each do | route |
    if route["pattern"] == entity_name
      puts "Route pattern is already used"
      return
    end
  end

  puts "Add route to manifest: #{entity_name}"
  routes << {
    "pattern" => entity_name,
    "name" => entity_name,
    "target" => entity_name + "Form"
  }
end

def add_tile(namespace, entity_name)
  # add tile to config
  config_path = File.join(__dir__, namespace, "webapp", "config.json")
  config_file =  File.open(config_path, "r")

  config = JSON.parse(config_file.read)
  if config["entryPoints"]
    entryPoints = config["entryPoints"]
    entryPoints.each do | entryPoint |
      if entryPoint["routeName"] == entity_name
        return
      end
    end

    entryPoints << {
      "header" => "{i18n>tiles.#{entity_name}.header}",
      "footer" => "{i18n>tiles.#{entity_name}.footer}",
      "tooltip" => "{i18n>#{entity_name}.tooltip}",
      "icon" => "sap-icon://form",
      "iconText" => "{i18n>tiles.#{entity_name}.iconText}",
      "routeName" => "#{entity_name}"
    }
    @i18n_keys << "tiles.#{entity_name}.header"
    @i18n_keys << "tiles.#{entity_name}.footer"
    @i18n_keys << "tiles.#{entity_name}.iconText"
    @i18n_keys << "#{entity_name}.tooltip"

    config_file =  File.open(config_path, "w")
    puts "Write #{config_path}"
    config_file.print JSON.pretty_generate(config)
  end
end

def addI18nKeys(namespace, available_languages)
  available_languages.each do | language_code |
    properties = {}

    path = File.join(__dir__, namespace, "webapp/i18n", "i18n_#{language_code}.properties" )

    File.open(path, "r") do | i18n_properties |
      i18n_properties.read.each_line do | line |
        line.strip!

        if line =~ /([^=]*)=(.*)/
          properties[$1.strip] = $2
        end
      end
    end
  
    @i18n_keys.each do | i18nkey |
      if properties[i18nkey] == nil
        properties[i18nkey] = ""
      end
    end
  
    puts "Write #{path}"
    outfile = File.open(path, "w+")
    properties.each do | key, value |
      outfile.puts "#{key}=#{value}\n"
    end
  end
end






puts "What is the component name? "
uinput = gets
namespace = uinput.chomp

oui5lib_configfile = File.join(__dir__, namespace, "webapp/oui5lib.json")

if File.exists? oui5lib_configfile
  file = File.read(oui5lib_configfile);
  configData = JSON.parse(file)
  mapping_directory = configData["mappingDirectory"]
  available_languages = configData["availableLanguages"]
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


  @i18n_keys = []

  cw = ContentWriter.new(namespace, namespace)
  cw.generate_form(entity_name, mapping, form_type, @i18n_keys)

  route_name = entity_name

  # add route/target to manifest
  manifest_path = File.join(__dir__, namespace, "webapp", "manifest.json")
  manifest_file =  File.open(manifest_path, "r")

  manifest = JSON.parse(manifest_file.read)
  if manifest["sap.ui5"]["routing"]["routes"]
    add_route(manifest["sap.ui5"]["routing"]["routes"], entity_name)
  end

  if manifest["sap.ui5"]["routing"]["targets"]
    puts "add/update target #{entity_name}Form"
    targets = manifest["sap.ui5"]["routing"]["targets"]
    targets[entity_name + "Form"] = {
      "viewName" => entity_name,
      "title" => "{i18n>#{entity_name}.form.title}"
    }

    @i18n_keys << "#{entity_name}.page.title"
    @i18n_keys << "#{entity_name}.form.title"
  end

  manifest_file =  File.open(manifest_path, "w")
  puts "Write #{manifest_path}"
  manifest_file.print JSON.pretty_generate(manifest)

  add_tile(namespace, entity_name)

  addI18nKeys(namespace, available_languages)
else
  puts "No mapping found at #{mapping_file}"
end
