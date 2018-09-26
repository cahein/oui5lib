require 'fileutils'
require 'uglifier'

class ContentWriter
  def initialize(namespace, path='output')
    @namespace = namespace
    @outpath = path

    working_dir = __dir__
    oui5lib_project_dir = working_dir.sub 'templates', ''
    @oui5lib_dir = File.join(oui5lib_project_dir, 'webapp')
  end


  def generate_template_component
    process_js_files
    process_file('webapp/index.html')
    process_file('webapp/manifest.json')
    process_file('webapp/oui5lib.json')
    FileUtils.cp 'BaseComponent/webapp/config.json', @outpath + '/webapp/config.json'
    FileUtils.copy_entry 'BaseComponent/webapp/i18n/', @outpath + '/webapp/i18n/'
    process_xml_files

    add_oui5lib_files
    process_project_files
  end

  def process_project_files
    process_file('Gruntfile.js')
    process_file('package.json')
    process_file('.eslintrc.json')
    FileUtils.cp File.join('BaseComponent', 'GruntRef.json'),
                 File.join(@outpath, 'GruntRef.json')
  end

  def process_js_files
    js_files = Dir.glob('BaseComponent/webapp/**/*.js')
    js_files.each do | fname |
      filename = fname.sub 'BaseComponent/', ''
      dirname = get_dirname(filename)

      process_file(filename)
    end
  end

  def process_xml_files
    files = Dir.glob('BaseComponent/webapp/**/*.xml')
    files.each do | fname |
      filename = fname.sub 'BaseComponent', ''
      dirname = get_dirname(filename)

      process_file(filename)
    end
  end

  def generate_form(entity_name, mapping, form_type, i18n_keys)
    view_out_file = File.new(File.join(@outpath, 'webapp', 'view', entity_name + '.view.js'), 'w')

    File.readlines('ViewTemplates/view/' + form_type + 'Template.view.js').each do | line |
      view_out_file.print transform_line(line, entity_name)

      if line.match('// form controls')
        view_out_file.print generate_form_controls(entity_name, mapping, form_type, i18n_keys)
      end
    end

    controller_out_file = File.new(File.join(@outpath, 'webapp', 'controller', entity_name + '.controller.js'), 'w')
    File.readlines('ViewTemplates/controller/formTemplate.controller.js').each do | line |
      controller_out_file.print transform_line(line, entity_name)
    end
  end

  def transform_line(line, entity_name)
    if line.match('ooooo.')
      line = line.gsub(/ooooo/, @namespace)
    end
    if line.match('eeeee')
      line = line.gsub(/eeeee/, entity_name)
    end
    if line.match('rrrrr.')
      line = line.gsub(/rrrrr/, entity_name)
    end
    line
  end

  def generate_form_controls(entity_name, mapping, form_type, i18n_keys)
    case form_type
    when "simpleForm"
      formControl = "#{entity_name}Form"
    when "form"
      formControl = "formContainer"
    end

    controls = ''
    mapping["entity"].each do | attributeSpec |
      if attributeSpec["ui5"] != nil && attributeSpec["ui5"]["sapuiControl"] != nil
        case attributeSpec["ui5"]["sapuiControl"]
        when "sap.m.Input"
          controls += "oController.addInput(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.MaskInput"
          controls += "oController.addMaskInput(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.TextArea"
          controls += "oController.addTextArea(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.Switch"
          controls += "oController.addSwitch(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.CheckBox"
          controls += "oController.addCheckBox(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.ComboBox"
          controls += "oController.addComboBox(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.MultiComboBox"
          controls += "oController.addMultiComboBox(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        when "sap.m.Select"
          controls += "oController.addSelect(#{formControl}, \"#{entity_name}\", \"#{attributeSpec["name"]}\");\n"
        end

        if attributeSpec["i18n"] != nil
          i18nKeys = attributeSpec["i18n"]

          if i18nKeys["label"] != nil
            i18n_keys << i18nKeys["label"]
          end
          if i18nKeys["tooltip"] != nil
            i18n_keys << i18nKeys["tooltip"]
          end
          if i18nKeys["invalid"] != nil
            i18n_keys << i18nKeys["invalid"]
          end
        end
      end
    end
    controls
  end

  def process_file(filename)
    out_file = File.new(File.join(@outpath, filename), 'w')
    File.readlines('BaseComponent/' + filename).each do | line |
      if line.match('ooooo.')
        modified_line = line.gsub(/ooooo/, @namespace)
        out_file.print modified_line
      else
        out_file.print line
      end
    end
  end

  def add_oui5lib_files
    output_dir = File.join(__dir__, @outpath, 'webapp', 'oui5lib')
    FileUtils::mkdir_p output_dir

    copy_folders = ['controller', 'fragment', 'i18n', 'view']
    copy_folders.each do | folder |
      FileUtils.copy_entry File.join(@oui5lib_dir, folder),
                           File.join(output_dir, folder)
    end
    add_oui5lib_uglified
  end

  def add_oui5lib_uglified
    files = [ 'init-preload.js',
              'lib/listHelper.js',
              'configuration.js',
              'logger.js',
              'util.js',
              'formatter.js',
              'messages.js',
              'event.js',
              'request.js',
              'currentuser.js',
              'mapping.js',
              'validation.js',
              'ui.js',
              'listBase.js',
              'itemBase.js' ]

    oui5lib_concat = ''
    files.each do | filename |
      File.readlines(File.join(@oui5lib_dir, filename)).each do | line |
        oui5lib_concat << line
      end
    end

    uglified = Uglifier.new(harmony: true).compile(oui5lib_concat)

    out_file = File.new(File.join(@outpath, 'webapp', 'oui5lib.js'), 'w')
    out_file.print uglified
  end

  def get_dirname(filename)
    dirname = File.join(@outpath, File.dirname(filename))

    if !File.directory?(dirname)
      create_folder(dirname)
    end

    dirname
  end

  def create_folder(path)
    FileUtils::mkdir_p File.join(Dir.pwd, path)
  end
end
