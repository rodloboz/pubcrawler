class CrawlsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_crawl, only: [:show, :edit, :update, :destroy]

  def index
    @crawls = policy_scope(Crawl)
  end

  def show
  end

  def new
    @crawl = Crawl.new
    authorize @crawl
    respond_to do |format|
      format.js
      format.html
    end
  end

  def create
    @crawl = Crawl.new(crawl_params)
  end

  def update
  end

  def edit
  end

  def destroy
    @crawl.destroy
  end

  private

    def set_crawl
      @crawl = crawl.find(params[:id])
      authorize @crawl
    end

    def crawl_params
      params.require(:crawl).permit(:name, :description, :city)
    end
end
