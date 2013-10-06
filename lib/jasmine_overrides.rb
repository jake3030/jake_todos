module JasmineRails
  module SpecRunnerHelper
    def jasmine_css_files
      Jasmine::Core.css_files + JasmineRails.send(:jasmine_config)["stylesheets"]
    end
  end
end

