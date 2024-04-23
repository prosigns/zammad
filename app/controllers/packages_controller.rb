# Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

class PackagesController < ApplicationController
  prepend_before_action :authenticate_and_authorize!

  # GET /api/v1/packages
  def index
    render json: {
      packages:             Package.reorder('name'),
      package_installation: File.exist?('/usr/bin/zammad'),
      local_gemfiles:       Dir['Gemfile.local.*'].present?
    }
  end

  # POST /api/v1/packages
  def install
    Package.install(string: params[:file_upload].read)
    redirect_to '/#system/package'
  end

  # DELETE /api/v1/packages
  def uninstall
    package = Package.find(params[:id])
    Package.uninstall(name: package.name, version: package.version)
    render json: {
      success: true
    }
  end

end
