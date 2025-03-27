class ReservationsController < ApplicationController
  before_action :set_reservation, only: [:show, :update, :destroy]

  # 予約一覧取得
  def index
    reservations = Reservation.includes(:customer).all
    render json: reservations
  end

  # 予約詳細取得
  def show
    render json: @reservation
  end

  # 新規予約作成
  def create
    reservation = Reservation.new(reservation_params)
    if reservation.save
      render json: reservation, status: :created
    else
      render json: { errors: reservation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 予約更新
  def update
    if @reservation.update(reservation_params)
      render json: @reservation
    else
      render json: { errors: @reservation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 予約削除
  def destroy
    @reservation.destroy
    head :no_content
  end

# GET /reservations/by_date?date=2025-03-25
def by_date
  date = params[:date]&.to_date || Date.today

  start_range = date.beginning_of_day
  end_range   = date.end_of_day

  reservations = Reservation.includes(:customer)
                            .where(start_at: start_range..end_range)
                            .order(:start_at)

  render json: reservations
end


  private

  def set_reservation
    @reservation = Reservation.find(params[:id])
  end

  def reservation_params
    params.require(:shift).permit(:user_id, :check_in, :check_out, :break_begin, :break_end)
  end
end
