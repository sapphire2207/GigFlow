import mongoose, {Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    }
}, {timestamps: true});

userSchema.pre("save", async function () {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods = {
    comparePassword: async function (plainTextPassword) {
        return bcrypt.compare(plainTextPassword, this.password);
    },

    generateAccessToken: function () {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                name: this.name,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );
    },
}

export const User = mongoose.models.user || model("User", userSchema);