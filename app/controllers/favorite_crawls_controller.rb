class FavoriteCrawlsController < ApplicationController
  before_action :set_crawl
  skip_after_action :verify_authorized

  def create
    if Favorite.create(favorited: @crawl, user: current_user)
      render json: { message: "Added crawl to favorites"}, status: :created
    else
      render_error
    end
  end

  def destroy
    if Favorite.where(favorited_id: @crawl.id, user_id: current_user.id).first.destroy
      render json: { message: "Deleted crawl from favorites"}, status: :accepted
    else
      render_error
    end
  end

  private

  def set_crawl
    @crawl = Crawl.find(params[:crawl_id])
  end

  def render_error
    render json: { message: "Something went wrong." }, status: :unprocessable_entity
  end
end
