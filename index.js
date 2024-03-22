// command
// nodemon package install-> npm i -g nodemon
// node + tab click to see output of js statement

// console.log("hello")
// console.log("mahmood")
// console.log("23")


// const http= require("http");
// const gfName= require("./features")
// console.log(gfName)

// import http from "http";
// // import gfName  from "./features.js";
// // import { gfName1,gfName2 } from "./features.js";
// import { generatePercent } from "./features.js";
// console.log(gfName)
// console.log(gfName1)
// console.log(gfName2)

// create server
// server ki routing
//  const server=http.createServer((req,res)=>{
//     // console.log(req.url)
//     if(req.url==="/about"){
//         // res.end("<h1>About page</h1>")
//         res.end(`<h1>love is: ${generatePercent()}</h1>`)
//     }
//     else if(req.url==="/"){
//         res.end("<h1>Home</h1>")
//     }
//     else if(req.url==="/contact"){
//         res.end("<h1>Contact</h1>")
//     }else{
//         res.end("<h1>Page not found</h1>")
//     }
    
// });
// server.listen(5000,()=>{
//     console.log("server is working")

// })



// **********************************************************




// Express 

// import express from "express";
// import path from "path";




// // made server using express
// const app = express();




// // temprerry error
// const users=[];


// // for serving the static file
// // path resolve current directory dega
// // all middleware use here
//  app.use(express.static(path.join(path.resolve(), "public")))
//  app.use(express.urlencoded({extended:true}));


// // setting up view Engine for using ejs
// app.set("view engine","ejs")




// app.get("/",(req,res)=>{
//     // res.send("mahmood")
//     // res.sendStatus(500)
//     // to make api
//     // res.json({
//     //     success:true,
//     //     products:[]
//     // })
//     // const pathlocation= path.resolve();
//     // res.sendFile(path.join(pathlocation,"./index.html"))


//     // use ejs
//     // accessign ejs file
//     res.render("index",{name:"zainab"})

//     // static file ko access which is present in public
//     // res.sendFile("index")



// })



// // lets make api for success url

// app.get("/success",(req,res)=>{
//     // yaha pe success html file hai sucess.ejs hai
//     res.render("success")

// })
// app.get("/add",(req,res)=>{
//     res.send("nice")

// })

// // app.post("/",(req,res)=>{
// //     console.log(req.body)
// //     // pussing the data into  users array
// //     users.push({username: req.body.name, email: req.body.email})
// //     // res.render("success")
// //     res.redirect("/success")
// // })
// app.post("/contact",(req,res)=>{
//     // pussing the data into  users array
//     users.push({username: req.body.name, email: req.body.email})
//     // res.render("success")
//     res.redirect("/success")
// })



// app.get("/users", (req,res)=>{
//     res.json({
//         users,
//     });
// })


// app.listen(5000,()=>{
//     console.log("server is working");
// })

// *****************************
// ####################################



// for mongo db



import express from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import  jwt  from "jsonwebtoken";



mongoose.connect(("mongodb://localhost:27017/"),{
    dbName:"backend",

}).then(()=>console.log("database Connected")).catch((e)=>console.log(e))


// define schema

// toos
const userSchema=  new mongoose.Schema({
    name:String,
    email:String,
})

// bassically collection bana rahe hai
const user= mongoose.model("User",userSchema )





// made server using express
const app = express();



// its middleware
app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({extended:true}));
// to accesss cookies
app.use(cookieParser())


// setting up view Engine for using ejs
app.set("view engine","ejs")



const isauthenticated= async (req,res,next)=>{
    const{token}= req.cookies;
    if(token){
            // res.render("logout")

            // decode krna hai token ko agar token hai toh
            // jwt verify ek toh token lega and secret of private key same jo hamne token me diya tha
            const decoded=   jwt.verify(token, "abhfjkgjfdjfjfjnfj");
            // console.log(decoded)
            req.user= await user.findById(decoded._id);






            next();
        }
        else{
            res.render("login")
        }

}











// jab jab hum is add end point pe hit karenge tab tab collection me data create hoga database me

// app.get("/add", async(req,res)=>{
//      await massage.create({name:"mahmood2", email:"mahmoodalam260312@gmail.com"})
//      res.send("nice")

// });


// for Login

// isauthenticated ek handler hai aur comma laga ke kitne bhi handler de sakte hu
// mtlb jaise hi / end point ko hit krenge toh usme hum multiple handler rakh sakte hai toh sabse pehle pehla handler chalega phir next ko call krne baad agla wala call hoga so on  

// jab token true hoga toh next hamre logut wale handler ko call krega jo ki doosr handle hai nai to pehla jo ki authenticated wala hai

app.get("/",isauthenticated,(req,res)=>{
// app.get("/",isauthenticated,(req,res)=>{
    // next()


// },
// (req,res)=>{}


// to access all the cookies beacuse req.cookies ek object deta hai isliye ise destructure kr sakte hai
// const{token}= req.cookies;
// if(token){
//     res.render("logout")
// }
// else{
//     res.render("login")
// }

//     // console.log(req.cookies);

//     // res.render("login")
console.log(req.user)

res.render("logout", {name:req.user.name})
})

app.post("/login",async(req,res)=>{
    // console.log(req.body)
    const{name, email}= req.body;

    // user basically collection hai ya modal hai jiske andar document hote hai aur uski id hoti hai
  const users=  await user.create({
        name,
        email,
    });

// jo bi user hamne create kiya hai uski ek id milegi usko hamne cookies ke andar token me store kr diya

// to decode our usersId
const token= jwt.sign({_id:users._id},"abhfjkgjfdjfjfjnfj");
// console.log(token)

    res.cookie("token", token,{
        httpOnly:true,
        expires: new Date(Date.now() + 60*1000) ,
    });
    res.redirect("/")
})
// post isliye nhi kiya keuki login me hame emailor password bhejna padta hai jabki logout me ni
app.get("/logout",(req,res)=>{
    res.cookie("token", null,{
        httpOnly:true,
        expires: new Date(Date.now() ) ,
    });
    res.redirect("/")
})












app.listen(5000,()=>{
    console.log("server is working");
})