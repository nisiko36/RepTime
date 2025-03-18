class CustomersController < ApplicationController
  def show
    customer = Customer.find(params[:id])
    render json: customer
  end
end
