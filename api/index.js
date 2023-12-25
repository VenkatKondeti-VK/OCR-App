import express from 'express'
import { client } from './google/visionAPI.js'
import Card from './models/ocrModel.js'
import formatText from './utils/formatText.js'
import { errorHandler } from './utils/error.js'
import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()


// DataBase Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("connected to MongoDB")
})
.catch((err) => {
    console.log(err)
})


// __dirname stores the path of the index.js file
const __dirname = path.resolve()

// Using express as app and attaching body parser middleware
const app = express()
app.use(express.json())


// TextDetection using Google Vision API's Client
const detectText = async (file_path) => {
    let [result] = await client.textDetection(file_path)
    return result.fullTextAnnotation.text
}



// API Endpoint to CREATE a OCR Card
app.post('/api/ocr', async (req, res, next) => {
    try{
        const imageUrl = req.body.url
        const rawText = await detectText(imageUrl)
        const jsonText = formatText(rawText)
        
        const cardData = {
            image: imageUrl,
            id: jsonText.id,
            name:jsonText.name,
            lastName:jsonText.lastName,
            dateOfBirth: jsonText.dob,
            dateOfIssue: jsonText.issue,
            dateOfExpiry: jsonText.expiry,
        }
        const card = await Card.create(cardData)

        res.status(200).json(jsonText)
    }
    catch(err){
        next(err)
    }
})

// API Endpoint to RETRIEVE all OCR Cards
app.get('/api/ocrs', async (req,res,next) => {
    try{
        const cards = await Card.find({})

        res.status(200).json(cards)
    }
    catch(err){
        next(err)
    }
})

// // API Endpoint to DELETE a OCR Card
app.delete('/api/ocr/delete/:id', async (req, res, next) => {
    const card = await Card.findById(req.params.id)

    if(!card){
        return next(errorHandler(404, 'Card not found'))
    }

    try{
        await Card.findByIdAndDelete(req.params.id)
        res.status(200).json("Card has been deleted")
    }
    catch(err){
        next(err)
    }
})


// connect the frontend and backend (dist is the folder created when front end gets built)
app.use(express.static(path.join(__dirname, '/client/dist')))

// any address except the above 3, we send the index.html file i.e inside 'dist'
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})


// MIDDLEWARE for Error Handling
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


app.listen(3000, (req, res) => {
    console.log("server running on port 3000")
})