namespace :freee do
  desc "Freee APIから従業員を取得してUserに同期"
  task sync_users: :environment do
    service = FreeeApiService.new
    employees = service.fetch_employees

    employees.each do |emp|
      user = User.find_or_initialize_by(email: emp["email"])  # emailで照合（すでに登録済みの可能性あり）
      user.name = emp["display_name"]                         # 名前を上書き
      user.freee_employee_id = emp["id"]                      # FreeeのIDを保存
      user.role ||= "staff"                                   # roleがなければ staff に設定
      user.save!
      puts "Synced: #{user.name} (#{user.email})"
    end

    puts "全ユーザー同期が完了しました！"
  end
end
