class UsersController < ApplicationController
  before_action :set_user, only: [:update, :destroy]

  # ユーザー一覧取得
  def index
    users = User.all
    render json: users
  end

  # 新規ユーザー作成
  def create
    user = User.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # ユーザー更新
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # ユーザー削除
  def destroy
    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :role, :rank_hall, :rank_kitchen, :wage_cents, :total_earned_cents, possible_tasks: {})
  end
end
