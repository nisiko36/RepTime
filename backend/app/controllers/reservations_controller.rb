class ReservationsController < ApplicationController
  before_action :set_reservation, only: [:show, :update, :destroy]

  # 予約一覧取得
  def index
    reservations = Reservation.includes(:customer).all
    render json: reservations.as_json(include: :customer)
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

  private

  def set_reservation
    @reservation = Reservation.find(params[:id])
  end

  def reservation_params
    params.require(:reservation).permit(:customer_id, :start_at, :end_at, :seat_number)
  end
end
