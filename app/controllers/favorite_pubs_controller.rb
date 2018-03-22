class FavoritePubsController < ApplicationController
  before_action :set_pub

  def create
    Favorite.create(favorited: @pub, user: current_user)
  end

  def destroy
    Favorite.where(favorited_id: @pub.id, user_id: current_user.id).first.destroy
  end

  private

  def set_pub
    @pub = Pub.find(params[:pub_id])
  end
end
