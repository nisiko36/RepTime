class OwnerMessagesController < ApplicationController
  before_action :set_owner_message, only: [:update, :destroy]
  before_action :authorize_owner, only: [:create, :update, :destroy]

  # オーナーメッセージ一覧取得
  def index
    messages = OwnerMessage.all.includes(:user)
    render json: messages, include: :user
  end

  # 新規オーナーメッセージ作成
  def create
    message = OwnerMessage.new(owner_message_params)
    if message.save
      render json: message, status: :created
    else
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # オーナーメッセージ更新
  def update
    if @owner_message.update(owner_message_params)
      render json: @owner_message
    else
      render json: { errors: @owner_message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # オーナーメッセージ削除
  def destroy
    @owner_message.destroy
    head :no_content
  end

  private

  def set_owner_message
    @owner_message = OwnerMessage.find(params[:id])
  end

  def authorize_owner
    user = User.find(params[:owner_message][:user_id])
    unless user.role == "owner"
      render json: { error: "You are not authorized to perform this action." }, status: :forbidden
    end
  end

  def owner_message_params
    params.require(:owner_message).permit(:user_id, :messages, :pinned)
  end
end
