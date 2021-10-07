const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const notes = require("./db/db.json")
const fs = require("fs");
const { dirname } = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', function(err, data){
    let notesWritten = JSON.parse(data)
    res.send(notesWritten)
});

});

app.post('/api/notes/edit',(req,res)=>{
    let note = req.body;
    fs.readFile('./db/db.json', 'utf8', function(err, data){
      let notesWritten = JSON.parse(data)
     // Display the file content
      for(const property in notesWritten){
        
        if(notesWritten[property].title == note.title){
          console.log("found a match")
          console.log(note.text)
          notesWritten[property].text= note.text 
          console.log(notesWritten[property].text)
        }
        else{console.log("no matches")}
      }
     
 
     fs.writeFile("./db/db.json", JSON.stringify(notesWritten), (err) => {
         if (err) {
           console.log(err);
         }
 
       // Log our request to the terminal
       res.send("posted to db")
     });
     });


})



app.post('/api/notes', (req, res) =>  {
  
  let note = req.body;
  fs.readFile('./db/db.json', 'utf8', function(err, data){
     let notesWritten = JSON.parse(data)
    // Display the file content
    notesWritten.push(note)
    console.log(notesWritten)

    fs.writeFile("./db/db.json", JSON.stringify(notesWritten), (err) => {
        if (err) {
          console.log(err);
        }

      // Log our request to the terminal
      console.info(`${req.method} request received to add note`);
      res.send("posted to db")
    });
    });

});
 

  app.delete("/api/notes/*", (req, res) =>  {
         const title = req.query.title;
         const text = req.query.text;

         fs.readFile('./db/db.json', 'utf8', function(err, data){
          let notesWritten = JSON.parse(data)
         // Display the file content
         
         for(const property in notesWritten){
           let testTitle = notesWritten[property].title
           let testText = notesWritten[property].text
            
            if(testTitle === title && testText === text){
            notesWritten.splice(property,1)  
            }
         }
          fs.writeFile("./db/db.json",JSON.stringify(notesWritten), (err) => {
            if (err) {
              console.log(err);
            }
          })

          
    
  })
  res.send("deleted note")
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
})