class CrawlsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_crawl, only: [:show, :edit, :update, :destroy]
  layout "search", only: [:show]

  def index
    @crawls = policy_scope(Crawl)
  end

  def show
    @features = @crawl.pubs.map do |pub|
        { "type": "Feature",
          "id": "#{pub.id}",
          "properties": {
            "description":
            "<div class=\"popup-bottom\">
            <h4 class=\"bold\">#{pub.name}</h4>
            <h5 class=\"light\">#{pub.district}</h5>
            </div>"
          },
          "geometry": {
              "type": "Point",
              "coordinates": [pub.longitude, pub.latitude]
          }
        }
      end
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
    authorize @crawl
    respond_to do |format|
      if @crawl.save
        params[:crawl][:pub_ids].each do |id|
          @crawl.pub_crawls.create(pub_id: id) unless id.blank?
        end
        format.html { redirect_to @crawl, notice: 'Pub was successfully created.' }
        format.json { render :show, status: :created, location: @crawl }
      else
        format.html { render :new }
        format.json { render json: @crawl.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
  end

  def edit
  end

  def destroy
    @crawl.destroy
  end

  def pubs
  end

  private

    def set_crawl
      @crawl = Crawl.find(params[:id])
      authorize @crawl
    end

    def crawl_params
      params.require(:crawl).permit(:name, :description, :city, :start_date, :end_date)
    end
end
