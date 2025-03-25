class CustomersController < ApplicationController
  before_action :set_customer, only: [:show, :update]

  # 顧客一覧取得
  def index
    customers = Customer.all.order(:created_at)
    render json: customers
  end

  # 顧客詳細取得
  def show
    render json: @customer
  end

  # 顧客情報更新
  def update
    if @customer.update(customer_params)
      render json: @customer
    else
      render json: { errors: @customer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_customer
    @customer = Customer.find(params[:id])
  end

  def customer_params
    params.require(:customer).permit(:name, :line_user_id, :square_customer_id, :line_display_name, :visit_count, :last_visit_at)
  end
end
