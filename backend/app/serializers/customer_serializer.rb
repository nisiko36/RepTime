class CustomerSerializer < ActiveModel::Serializer
  attributes :id, :name, :line_user_id, :square_customer_id, :visit_count, :last_visit_at
end
