class AttendanceMemoSerializer < ActiveModel::Serializer
  attributes :id, :content, :created_at

  belongs_to :user, serializer: UserSerializer
end
