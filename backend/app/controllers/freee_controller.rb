class FreeeController < ApplicationController
  before_action :initialize_service

  # 従業員一覧を取得
  def employees
    employees_data = @service.fetch_employees

    # ArrayかHashかエラーをハンドリング
    if employees_data.is_a?(Hash) && employees_data[:error]
      render json: employees_data, status: employees_data[:status]
    else
      render json: employees_data, status: :ok
    end
  end


  # 勤怠打刻を登録
  ALLOWED_CLOCK_TYPES = %w[clock_in clock_out break_begin break_end].freeze
  def time_clock
    Rails.logger.info "受信した params: #{params.inspect}"

    begin
      # パラメータ取得 & 整形
      permitted_params = params[:freee] || params
      employee_id = permitted_params[:employee_id].to_s.strip
      clock_type  = permitted_params[:clock_type].to_s.strip
      datetime    = permitted_params[:datetime].to_s.strip
      note        = permitted_params[:note].to_s.strip rescue ""


      # 日時フォーマット統一
      formatted_datetime = Time.parse(datetime).strftime("%Y-%m-%d %H:%M")

      Rails.logger.info "送信データ: employee_id=#{employee_id}, clock_type=#{clock_type}, datetime=#{formatted_datetime}"

      # APIリクエスト実行
      response = @service.post_time_clock(employee_id, clock_type, formatted_datetime, note)

      # レスポンス処理
      if response.is_a?(Hash) && response[:error]
        Rails.logger.error "Freee API エラー: #{response[:error]}"
        render json: response, status: response[:status]
      else
        render json: response, status: :created
      end
    rescue => e
      Rails.logger.error "time_clock 実行時エラー: #{e.message}"
      render json: { error: "サーバーエラー", details: e.message }, status: :internal_server_error
    end
  end

  private

  def initialize_service
    @service = FreeeApiService.new
  rescue => e
    render json: { error: "APIの初期化に失敗しました: #{e.message}" }, status: :internal_server_error
  end
end
