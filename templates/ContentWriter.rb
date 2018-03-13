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


  def generateTemplateComponent
    process_js_files
    process_file('webapp/index.html')
    process_file('webapp/manifest.json')
    process_file('webapp/oui5lib.json')
    FileUtils.cp 'BaseComponent/webapp/config.json', @outpath + '/webapp/config.json'
    FileUtils.copy_entry 'BaseComponent/webapp/i18n/', @outpath + '/webapp/i18n/'
    copy_xml_files

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

  def copy_xml_files
    files = Dir.glob('BaseComponent/webapp/**/*.xml')
    files.each do | fname |
      filename = fname.sub 'BaseComponent', ''
      dirname = get_dirname(filename)

      FileUtils.cp fname, File.join(@outpath, filename)
    end
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
              'formatter.js',
              'util.js',
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
