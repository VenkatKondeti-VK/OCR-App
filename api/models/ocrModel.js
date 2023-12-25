import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
    image:{
        type: String,
        unique:true,
        required: true,
    },
    id:{
        type: String,
        unique:true,
        required: true,
    },
    name:{
        type: String,
        unique:true,
        required: true,
    },
    lastName:{
        type: String,
        unique:true,
        required: true,
    },
    dateOfBirth:{
        type: String,
        unique:true,
        required: true,
    },
    dateOfIssue:{
        type: String,
        unique:true,
        required: true,
    },
    dateOfExpiry:{
        type: String,
        unique:true,
        required: true,
    },
}, {timestamps: true})

const Card = mongoose.model("Card", cardSchema)

export default Card