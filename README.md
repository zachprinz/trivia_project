# trivia_project
CS 499 Project


Setup Instructions:


Database Setup


install roboMongo (optional GUI for mongoDB editing)

install mongoDB

run mongod --dbpath ~/Documents/mongo-data (change file path if neccesary)

connect to mongoDB with roboMongo (default port)

Create Database with name 'trivia_project'

Create Collection with name 'questions'

Create Document in 'questions' collection add the following content (question)


{

    "_id" : ObjectId("58164d9c83765378705b1f73"),
    
    "question" : "Inside which HTML element do we put the JavaScript?",
    
    "correct" : "<script>",
    
    "answers" : [ 
    
        "<javascript>", 
        
        "<js>", 
        
        "<scripting>", 
        
        "<script>"
        
    ]
    
}



Node Setup


install node.js v^7.0.0

fork trivia_project repository

navigate to the root file of trivia_project

run npm install

navigate to root folder of trivia_project

run node ./src/server.js


Open url localhost:3000
