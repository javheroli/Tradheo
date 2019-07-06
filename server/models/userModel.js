const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    birthDate: {
        type: Date,
        required: true,
    },
    registrationDate: {
        type: Date,
        required: true,
        default: Date.now()

    },
    licence: {
        type: Boolean,
        required: true,
        default: true
    },
    licenceDate: {
        type: Date,
        required: true,
        default: Date.now() + 7 * 24 * 60 * 60 * 1000
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/tradheo/image/upload/v1561651255/userImages/default.png'
    }
});

//Fuction to hash password in text plain
UserSchema.pre('save', async function (next) {
    const user = this;
    //Hash done with 10 rounds, higher number means more secure but slower application
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

//Function to verify a password stored in DB
UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    //Hash the password test plain introduced by user and compare with the one stored in DB
    //return boolean result
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;