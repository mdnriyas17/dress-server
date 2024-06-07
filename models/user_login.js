const mongoose = require("mongoose")

const user_schema = {
    name: String,
    phone_number: { type: Number, required: true, unique: true },
    email_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    display_name: String,
    is_blocked: { type: Boolean, default:false},
    done_by: { type: mongoose.Schema.Types.ObjectId },
    created_at: { type: Date, default: Date.now() },
    status: { type: Boolean, default: true },
}

module.exports = user_schema