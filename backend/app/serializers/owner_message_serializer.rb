class OwnerMessageSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :messages, :created_at, :updated_at, :posted_on
end
