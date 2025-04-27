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

ActiveRecord::Schema[7.2].define(version: 2025_04_27_140543) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

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
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "owner_id"
    t.integer "members"
    t.integer "member_count", default: 0
  end

  create_table "event_attendances", force: :cascade do |t|
    t.integer "event_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id", "user_id"], name: "index_event_attendances_on_event_id_and_user_id", unique: true
    t.index ["event_id"], name: "index_event_attendances_on_event_id"
    t.index ["user_id"], name: "index_event_attendances_on_user_id"
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

  create_table "post_likes", force: :cascade do |t|
    t.integer "post_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id", "user_id"], name: "index_post_likes_on_post_id_and_user_id", unique: true
    t.index ["post_id"], name: "index_post_likes_on_post_id"
    t.index ["user_id"], name: "index_post_likes_on_user_id"
  end

  create_table "posts", primary_key: "post_id", force: :cascade do |t|
    t.string "post_name"
    t.text "content", null: false
    t.integer "views_count"
    t.integer "comments_count"
    t.integer "club_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "liked_by"
    t.integer "likes_count", default: 0
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "username"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "club_members", "clubs", primary_key: "club_id"
  add_foreign_key "club_members", "users", primary_key: "user_id"
  add_foreign_key "event_attendances", "events", primary_key: "event_id"
  add_foreign_key "event_attendances", "users", primary_key: "user_id"
  add_foreign_key "events", "clubs", primary_key: "club_id"
  add_foreign_key "post_likes", "posts", primary_key: "post_id"
  add_foreign_key "post_likes", "users", primary_key: "user_id"
  add_foreign_key "posts", "clubs", primary_key: "club_id"
  add_foreign_key "posts", "users", primary_key: "user_id"
end
