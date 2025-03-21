module FreeeConfig
  def self.access_token
    ENV["FREEE_ACCESS_TOKEN"] || Rails.application.credentials.dig(:freee, :access_token)
  end

  def self.company_id
    ENV["FREEE_COMPANY_ID"] || Rails.application.credentials.dig(:freee, :company_id)
  end
end
