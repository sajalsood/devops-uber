"use strict";
const express = require("express");
const app = express();
var cors = require('cors');
const mongoose = require('mongoose')
const port = process.env.port || 4444;
const User = require('.././database/User.model')
const Bus = require('.././database/bus.model')
const Booking = require('.././database/booking.model')

app.use(cors())
app.use(express.json())

const mongoURI = 'mongodb://localhost:27017/UberDB'

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true ,
         useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get("/", (req, res) => {
  res.send("abc");
});

app.listen(port, err => {
  if (err) {
    return console.log("ERROR", err);
  }
  console.log(`Listening on port ${port}`);
});

app.post('/login',(req, res) => {
    var passquery = { Email: req.body.email };
    User.find(passquery).then(user=>{
        if(user.length>0){
        if(user[0].Password==req.body.password){
            res.send({"User_id":user[0].User_id,"UserName":user[0].UserName})
        }
        else{
            res.json({ error: 400 ,msg:'Email and Password doesnt not match'})
        }
    }
    else{
        res.json({ error: 400 ,msg:'Email does not exist'})
    }
    })
    .catch(err => {
        res.send('error: ' + err)
      })
})

app.post('/register',(req, res) => {
    var passquery = { UserName: req.body.UserName };
    User.find(passquery).then(user => {
        if (user.length>0) {
          res.json({ error: 400 ,msg:'User exists already'})
        } else {
          var user = new User();
          user.User_id = req.body.UserId;
          user.UserName = req.body.UserName;
          user.Password = req.body.password;
          user.Email = req.body.email;
          user.save((err,doc)=>{
          if(!err){
            res.send(doc);
          }
          else{
            console.log("Error in inserting data"+err);
          }
        })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
    })

    app.get('/getAllBuses',(req,res)=>{
        Bus.find().then(bus=>{
            res.send(bus);
        }).catch(err => {
            res.send('error: ' + err)
          })
    })
 
  app.post('/addBus',(req,res)=>{
    var buse=new Bus();
    buse.Bus_id=req.body.busId;
    buse.Source=req.body.source;
    buse.Destination=req.body.dest;
    buse.Total_seats=req.body.totalSeats;
    buse.Available_seats=req.body.totalSeats;
    buse.save((err,doc)=>{
        if(!err){
          res.send(doc);
        }
        else{
          console.log("Error in inserting data"+err);
        }
      })
})
app.post('/addBooking',(req,res)=>{
    var booking=new Booking();
    Bus.find({ $and: [{Bus_id:{$eq:req.body.busId}},{Available_seats:{$gt:req.body.seats}}]}).then(bus=>{
        if(bus.length>0){
            booking.Bus_id=req.body.busId;
            booking.User_id=req.body.userId;
            booking.Booking_id=req.body.bookingId;
            booking.Seats=req.body.seats;
            booking.booking_date=new Date();
            booking.save((err,doc)=>{
                if(!err){
                res.send(doc);
                }
                else{
                console.log("Error in inserting data"+err);
                }
            })
        }
        else{
            res.json({ error: 400 ,msg:'Not enough seats available'})
        }
       
    }).catch(err => {
        res.send('error: ' + err)
      })
        
})
// app.get('/getAllBookings',(req,res)=>{
//     Booking.find().then(booking=>{
//         res.send(booking);
//     }).catch(err => {
//         res.send('error: ' + err)
//       })
// })
app.get('/getAllBookings',(req,res)=>{
    Booking.aggregate([
        { $lookup:
            {
              from: 'buses',
              localField: 'Bus_id',
              foreignField: 'Bus_id',
              as: 'bookingdetails'
            }
          },{ $match: {"orderdetails":{$ne:[]}}}
    ],function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }})
})
app.post('/getBookingByUserId',(req,res)=>{
    Booking.find({User_id:{$eq:req.body.userId}}).then(booking=>{
        res.send(booking);
    }).catch(err => {
        res.send('error: ' + err)
      })
})