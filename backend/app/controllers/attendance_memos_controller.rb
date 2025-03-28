class AttendanceMemosController < ApplicationController
    def index
        memos = AttendanceMemo.includes(:user).all
        render json: memos
    end

    def create
        memo = AttendanceMemo.new(attendance_memo_params)
        if memo.save
            render json: memo, status: :created
        else
            render json: { errors: memo.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        memo = AttendanceMemo.find(params[:id])
        if memo.update(attendance_memo_params)
            render json: memo, status: :ok
        else
            render json: { errors: memo.errors.full_messages }, status: :unprocessable_entity
        end
    end


    def destroy
        memo = AttendanceMemo.find(params[:id])
        memo.destroy
        head :no_content
    end

    private

    def attendance_memo_params
        params.require(:attendance_memo).permit(:user_id, :date, :memo_type, :content)
    end
end
