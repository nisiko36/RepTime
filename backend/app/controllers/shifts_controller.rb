class ShiftsController < ApplicationController
  before_action :set_shift, only: [:update, :destroy]

  # シフト一覧取得
  def index
    shifts = Shift.includes(:user).all
    render json: shifts, include: :user
  end

  # 新規シフト作成
  def create
    shift = Shift.new(shift_params)
    if shift.save
      render json: shift, status: :created
    else
      render json: { errors: shift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # シフト更新
  def update
    if @shift.update(shift_params)
      render json: @shift
    else
      render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # シフト削除
  def destroy
    @shift.destroy
    head :no_content
  end

  private

  def set_shift
    @shift = Shift.find(params[:id])
  end

  def shift_params
    params.require(:shift).permit(:user_id, :check_in, :check_out, breaks: {})
  end
end
