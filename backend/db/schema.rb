# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_03_22_050310) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attendance_memos", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "date"
    t.string "memo_type"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_attendance_memos_on_user_id"
  end

  create_table "customer_memos", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.bigint "user_id", null: false
    t.text "content"
    t.integer "likes_count"
    t.boolean "is_shared"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_customer_memos_on_customer_id"
    t.index ["user_id"], name: "index_customer_memos_on_user_id"
  end

  create_table "customers", force: :cascade do |t|
    t.string "name"
    t.integer "visit_count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "square_customer_id"
  end

  create_table "owner_messages", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.json "messages"
    t.boolean "pinned"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_owner_messages_on_user_id"
  end

  create_table "reservations", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.datetime "start_at"
    t.datetime "end_at"
    t.integer "seat_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_reservations_on_customer_id"
  end

  create_table "shift_requests", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "date"
    t.string "shift_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_shift_requests_on_user_id"
  end

  create_table "shift_rules", force: :cascade do |t|
    t.json "rule_content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shifts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "check_in"
    t.datetime "check_out"
    t.json "breaks"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_shifts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "role"
    t.integer "rank_hall"
    t.integer "rank_kitchen"
    t.integer "wage_cents"
    t.integer "total_earned_cents"
    t.json "possible_tasks"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "freee_employee_id"
  end

  add_foreign_key "attendance_memos", "users"
  add_foreign_key "customer_memos", "customers"
  add_foreign_key "customer_memos", "users"
  add_foreign_key "owner_messages", "users"
  add_foreign_key "reservations", "customers"
  add_foreign_key "shift_requests", "users"
  add_foreign_key "shifts", "users"
end
