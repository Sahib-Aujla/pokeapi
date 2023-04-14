const express = require("express")
const app = express()
const HTTP_PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.static("assets"))

const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        json: (context) => { return JSON.stringify(context) }
    }
   }));
app.set("view engine", ".hbs")

// TODO: Include CORS
const cors = require("cors")
app.use(cors())

/// --------------
// DATABASE : Connecting to database and setting up your schemas/models (tables)
/// --------------

const mongoose = require('mongoose');
// TODO: Replace this with your mongodb connection string
// The mongodb connection string is in the MongoAtlas web interface
try {
mongoose.connect("mongodb+srv://sahibpreet:sahibpreet@cluster0.gkshq6v.mongodb.net/?retryWrites=true&w=majority");
console.log("connected");
    
} catch (error) {
    console.log(error);
}

// Schemas and models
const Schema = mongoose.Schema
const PokemonSchema = new Schema({name:String, type:String, image:String, desc:String, pokedexId:String})
const Pokemon = mongoose.model("pokemon_collections", PokemonSchema)

// ----------------
// endpoints
// ----------------
app.get("/", (req, res) => {
    res.render("index", {layout:false})    
})

// get all pokemon
app.get("/api/v1/pokemon/", async (req, res)=> {
    console.log(`[DEBUG] Request received at /v1/pokmeon endpoint`)
    try {        
        // going to the Mongo Pokemon collection, and retrieving all pokemon
        const pokemonList = await Pokemon.find()
        console.log(`[DEBUG] Data from database`)
        console.log(pokemonList)        
        // TODO: Return the database results as json
        // res.send() --> send a string
        // res.sendFile() --> send a file 
        // res.render()--> send an hbs template
        // res.json() --> send json back
        res.json(pokemonList);
    } catch (err) {
        console.log(err)
    }    
})
// get one pokemon
app.get("/api/v1/pokemon/:pokeName", async (req, res) => {
    console.log("[DEBUG] Request made to /api/pokemon/Name")
    const pokemonFromParams = req.params.pokeName
    console.log(`[DEBUG] Searching for ${pokemonFromParams}`)

    try {        
        const pokemon = await Pokemon.findOne({name:pokemonFromParams})
        console.log(`[DEBUG] Results from db`)
        console.log(pokemon)
        // TODO: Return database results as json
        if(pokemon){
            res.json(pokemon);
        }
    } catch (err) {
        console.log(err)        
    } 
})
// insert pokemon
app.post("/api/v1/pokemon/", async (req, res)=>{
    // get the data from the form
    // return res.json({msg:"Success"})
})


// ----------------
const onHttpStart = () => {
  console.log(`Express web server running on port: ${HTTP_PORT}`)
  console.log(`Press CTRL+C to exit`)
}
app.listen(HTTP_PORT, onHttpStart)
