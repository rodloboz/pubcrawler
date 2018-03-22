class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: :home

  def home
    @pubs = Pub.all #.limit(9)
  end
end
