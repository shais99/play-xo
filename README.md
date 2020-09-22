# X-O Game

![alt text](https://res.cloudinary.com/shaishar9/image/upload/v1593329069/cvzzijafk7ra0ht7rfba.jpg "x-o main screenshot")

A fun game that I build to practice my Vue.js & Vuex capabillities.<br />
Developed multiple frontend components, designed the RESTful API,<br />
implemented the entire backend and developed the database.

[Try It Now](https://play-xo.herokuapp.com/)

Example game object:
```
{
    "_id" : ObjectId(""),
    "mat" : [ 
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ],
    "players" : [ 
        {
            "id" : "p1",
            "name" : "name",
            "symbol" : "X",
            "isActive" : true
        }
    ],
    "winner" : {
        "name" : ""
    },
    "isDraw" : false,
    "isTimesUp" : true,
    "createdAt" : "",
    "currTurn" : {
        "id" : "",
        "name" : "",
        "symbol" : "X"
    }
}
```

#### Technological stack:
Vue.js, Vuex, Node.js, Express, RESTful API, MongoDB, WebSockets<br />
Axios, HTML5, Sass, Heroku, Cloudinary, SPA
