#!/usr/bin/env ruby
$LOAD_PATH << '.'

require 'ContentWriter'

puts "What is the component name? "
uinput = gets
namespace = uinput.chomp

if !(/^[a-zA-Z]+$/.match(namespace))
  puts "The component name must be letters only."
  exit
end
if File.directory? File.join(__dir__, namespace)
  puts "The folder for the template component already exists. Please remove or rename."
  exit
end


cw = ContentWriter.new(namespace, namespace)
cw.generate_template_component
