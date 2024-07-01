const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    firstName: String,
    lastName: String,
    image: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    access: {
        type: Array,
        required: true,
        trim: true
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Apps'
    }
});

UserSchema.methods.comparePassword = function (password) {
    //return bcrypt.compareSync(password, this.password)
    if (password == this.password) {
        return password;
    }
}

module.exports = mongoose.model('User', UserSchema);