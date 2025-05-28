const express = require("express");
const send = require("send");
const mysql = require("mysql2");
const { json } = require("body-parser");
const multer = require('multer')
const app = express();
const path = require('path')
const fs = require('fs')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'locations'
});


async function createDirectory(path){
    let exist = true
    try {
        exist = await fs.mkdir(path)
    }catch(error){
        console.error(error.message)
    }
    return exist
}

async function directoryExist(path){
    try {
        await fs.existsSync(path)
        console.log("Created Directory")
    }catch(error){
        console.error(error.message)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const id = file.originalname.split('.')[0]
        pathForSave = 'Images/'+id
        fs.mkdirSync(pathForSave, {recursive: true})
        
        cb(null, pathForSave)
    },
    filename: (req, file, cb) => {
        const id = file.originalname.split('.')[0]

        cb(null, id + '_'+   Date.now().toString() + '.jpg')
    }
})

const upload = multer({storage: storage})


function savePumpDatabase(req, res){

    openingHour = req.body.openingHours
    if (typeof openingHour === 'undefined') openingHour = null

    pool.execute('INSERT INTO pumps (name, lat, lon, description, openinghour) VALUES (?, ?, ?, ?, ?)', [req.body.name, req.body.lat, req.body.lon, req.body.description, openingHour], function(err, result){
        if(err){
            console.log(req.body)
            console.log(err)
            res.status(507)
            res.send("Error at writing data")
        }else{ 
            
            const resData = {id: result.insertId}
            const jsonData = JSON.stringify(resData)
            console.log('Data succesfully saved')
            console.log(req.body)
            res.send(jsonData)
        }
        
    });
}


function saveImage(req, res){
    //let thumbnail = req.file.destination + "/" + req.file.filename
    pool.execute('UPDATE locations.pumps SET thumbnail = ? WHERE id= ? AND ISNULL(thumbnail)', [req.file.filename, req.query.id])
    res.send('Uploaded')
}

function findImages(path, id){
    const pathId = path.split("id")[1]
    if (pathId = id) return true
    else return false
}

// Beginn of LOGIC

getFile = function(req, res){
 
    res.download('Images' + req.params.path);
}

app.use(express.static('Images'))

app.use(json())


app.get("/locations", (req, res) => {
    //console.log(req.query.lon)
    
    pool.execute("SELECT *, (111.3 * cos(radians(( lat + ? ) / 2* 0.01745)) * (lon - ?))   AS dx , 111.3 * (lat - ?) AS dy FROM pumps having sqrt(power(dx,2) + power(dy,2)) < ?", [req.query.lat, req.query.lon, req.query.lat, req.query.maxdist], function(err, result, fields){
        if(err){
            console.log("reading erro")
            res.status(507)
            res.send("error at reading data")
        }else{ 
            
            
            const resJSON = result.map( row => {
                var openH = null
                try {
                    openH = JSON.parse(row.openinghour);
                } catch(e){}   
                return{
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    lat: row.lat,
                    lon: row.lon,
                    rating: row.rating,
                    openingHours: openH,
                    thumbnail: row.thumbnail
                }
            })
            console.log("succesfully send data")
            res.send(JSON.stringify(resJSON));
        }
    })
});

app.get("/location", (req, res) => {
    //console.log(req.query.lon)
    
    pool.execute("SELECT * FROM pumps WHERE id = ?", [req.query.id], function(err, result, fields){
        if(err){
            console.log(req.query.id)
            res.status(507)
            res.send("error at reading data")
        }else{ 
            
            
            const resJSON = result.map( row => {
                var openH = null
                try {
                    openH = JSON.parse(row.openinghour);
                } catch(e){}   
                return{
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    lat: row.lat,
                    lon: row.lon,
                    rating: row.rating,
                    openingHours: openH,
                    thumbnail: row.thumbnail
                }
            })
            console.log("succesfully send data")
            res.send(JSON.stringify(resJSON));
        }
    })
});

app.post("/locations", savePumpDatabase);



app.post("/images", upload.single('image'), saveImage)

app.post("/rating", (req, res, next) => {
    if(req.body.rating <= 0 || req.body.rating > 5){
        console.log('not valid')
        res.send('not valid')
        return
    }
    pool.execute('INSERT INTO locations.ratings (rating, comment, userID, pumpID) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?, comment = ?;', [req.body.rating, req.body.comment, req.query.userid, req.body.locationId, req.body.rating, req.body.comment], function(err, result){
        if(err){
            console.log(req.body)
            console.log(err)
            res.status(507)
            res.send("Error at writing data")
        }else{ 
            
            const resData = {id: result.insertId}
            const jsonData = JSON.stringify(resData)
            console.log(result)
            res.body = jsonData
            next()
        }
        
    });
})
//  SELECT AVG(rating) FROM ratings WHERE rating > 0 AND rating < 6
app.post("/rating", (req, res, next) => {
    pool.execute('SELECT AVG(rating) AS avarage FROM ratings WHERE pumpID = ? AND rating > 0 AND rating < 6;',[req.body.locationId], function(err, result){
        if(err){
            res.send()
        }else{ 
            console.log(req.params)
            res.locals.avg = result[0].avarage
            next()
        }  
    });
})

app.post("/rating", (req, res) => { 
    pool.execute("UPDATE pumps SET rating = ? WHERE id = ?;", [req.body.rating, req.body.locationId], function(err, result){
        res.send()
        
    });
})

app.get("/images", (req, res) => {
    const id = req.query.id
    const directoryPath = path.join( "Images",id.toString())
    console.log(directoryPath)
    fs.readdir(directoryPath, (err, files) =>{
        if(err){
            send('directory not found')
        }
        console.log(files)
        /*
        for(file in files){
            console.log(file)
        }*/

        res.send(JSON.stringify(files))
    })
})

app.get("/ratings", (req, res) => {
    const id = req.query.id
    console.log(id)
    pool.execute("SELECT rating, comment, pumpID AS locationId FROM ratings WHERE pumpID = ?", [id], function(err, result, fields){
        if(err){
            console.log("reading error")
            res.status(507)
            res.send("error at reading data")
        }else{
            console.log(result)
            res.send(JSON.stringify(result));
        }
    })
})

app.post("/openinghours", (req, res) => {
    pool.execute("UPDATE pumps SET openinghour = ? WHERE id = ?;", [req.body, req.query.id], function(err, result){
        console.log("saved OH") 
        res.send()
        
    });
})

app.listen(8000);