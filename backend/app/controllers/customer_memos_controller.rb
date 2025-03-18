class CustomerMemosController < ApplicationController
  before_action :set_customer_memo, only: [:update, :destroy]

  # 顧客メモ一覧取得
  def index
    if params[:customer_id]
      memos = CustomerMemo.where(customer_id: params[:customer_id]).includes(:user)
    else
      memos = CustomerMemo.all.includes(:user)
    end
    render json: memos, include: :user
  end

  # 新規顧客メモ作成
  def create
    memo = CustomerMemo.new(memo_params)
    if memo.save
      render json: memo, status: :created
    else
      puts memo.errors.full_messages
      render json: { errors: memo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 顧客メモ更新
  def update
    if @customer_memo.update(memo_params)
      render json: @customer_memo
    else
      render json: { errors: @customer_memo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 顧客メモ削除
  def destroy
    @customer_memo.destroy
    head :no_content
  end

  private

  def set_customer_memo
    @customer_memo = CustomerMemo.find(params[:id])
  end

  def memo_params
    params.require(:customer_memo).permit(:customer_id, :user_id, :content, :likes_count, :is_shared)
  end
end

