class ApplicationController < ActionController::Base
  protect_from_forgery
  before_action :authenticate_user!
  layout :layout_by_resource

  private

  def layout_by_resource
    if devise_controller? && action_name != "edit"
      "authentication"
    else
      "application"
    end
  end
end
