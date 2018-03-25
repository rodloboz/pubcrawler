class PubsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_pub, only: [:show, :edit, :update, :destroy]
  layout "search", only: [:index]

  # GET /pubs
  # GET /pubs.json
  def index

    @pubs = policy_scope(Pub).where.not(latitude: nil, longitude: nil)

    @markers = @pubs.map do |pub|
      {
        lat: pub.latitude,
        lng: pub.longitude,
        icon: view_context.image_path("map-marker-black.png"),
        infoWindow: { content: render_to_string(partial: "/pubs/map_box", locals: { pub: pub }) }
      }
    end
  end

  # GET /pubs/1
  # GET /pubs/1.json
  def show
    @marker = [
      @pub.latitude,
      @pub.longitude
    ]
    respond_to do |format|
      format.js
      format.html
    end
  end

  # GET /pubs/new
  def new
    @pub = Pub.new
    authorize @pub
    respond_to do |format|
      format.js
      format.html
    end
  end

  # GET /pubs/1/edit
  def edit
  end

  # POST /pubs
  # POST /pubs.json
  def create
    @pub = Pub.new(pub_params)
    authorize @pub

    respond_to do |format|
      if @pub.save
        format.html { redirect_to @pub, notice: 'Pub was successfully created.' }
        format.json { render :show, status: :created, location: @pub }
      else
        format.html { render :new }
        format.json { render json: @pub.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pubs/1
  # PATCH/PUT /pubs/1.json
  def update
    respond_to do |format|
      if @pub.update(pub_params)
        format.html { redirect_to @pub, notice: 'Pub was successfully updated.' }
        format.json { render :show, status: :ok, location: @pub }
      else
        format.html { render :edit }
        format.json { render json: @pub.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pubs/1
  # DELETE /pubs/1.json
  def destroy
    @pub.destroy
    respond_to do |format|
      format.html { redirect_to pubs_url, notice: 'Pub was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pub
      @pub = Pub.find(params[:id])
      authorize @pub
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def pub_params
      params.require(:pub).permit(:name, :address, :description, :photo, :district)
    end
end
