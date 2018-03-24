class FavoritePubsController < ApplicationController
  before_action :set_pub
  skip_after_action :verify_authorized

  def create
    if Favorite.create(favorited: @pub, user: current_user)
      render json: { message: "Added pub to favorites"}, status: :created
    else
      render_error
    end
  end

  def destroy
    if Favorite.where(favorited_id: @pub.id, user_id: current_user.id).first.destroy
      render json: { message: "Deleted pub from favorites"}, status: :accepted
    else
      render_error
    end
  end

  private

  def set_pub
    @pub = Pub.find(params[:pub_id])
  end

  def render_error
    render json: { message: "Something went wrong." }, status: :unprocessable_entity
  end
end
