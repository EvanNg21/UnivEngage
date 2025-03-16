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

ActiveRecord::Schema[7.2].define(version: 2025_03_16_093234) do
  create_table "club_members", force: :cascade do |t|
    t.integer "club_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "member"
    t.index ["club_id", "user_id"], name: "index_club_members_on_club_id_and_user_id", unique: true
    t.index ["club_id"], name: "index_club_members_on_club_id"
    t.index ["user_id"], name: "index_club_members_on_user_id"
  end

  create_table "clubs", primary_key: "club_id", force: :cascade do |t|
    t.string "club_name"
    t.integer "members"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "owner_id"
  end

  create_table "events", primary_key: "event_id", force: :cascade do |t|
    t.string "event_name", null: false
    t.text "description"
    t.datetime "event_date", null: false
    t.datetime "start_time"
    t.datetime "end_time"
    t.string "location"
    t.integer "club_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["club_id"], name: "index_events_on_club_id"
  end

  create_table "posts", primary_key: "post_id", force: :cascade do |t|
    t.string "post_name"
    t.text "content", null: false
    t.integer "views_count"
    t.integer "likes_count"
    t.integer "comments_count"
    t.string "image"
    t.integer "club_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["club_id"], name: "index_posts_on_club_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "users", primary_key: "user_id", force: :cascade do |t|
    t.string "email"
    t.string "password"
    t.string "first_name"
    t.string "last_name"
    t.text "bio"
    t.date "date_of_birth"
    t.string "profile_picture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "username"
  end

  add_foreign_key "club_members", "clubs", primary_key: "club_id"
  add_foreign_key "club_members", "users", primary_key: "user_id"
  add_foreign_key "events", "clubs", primary_key: "club_id"
  add_foreign_key "posts", "clubs", primary_key: "club_id"
  add_foreign_key "posts", "users", primary_key: "user_id"
end
