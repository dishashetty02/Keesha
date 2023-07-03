//mini application

const  express=require("express")     
const router=express.Router()

//static routes

router.get('/',(req,res)=>
{
    res.send("user list")
})

router.get('/new',(req,res)=>
{
   res.render("users/new")
})

router.post('/',(req,res)=>
{
    console.log(req.body.firstName)
    res.send("hi")
   // res.send("create user")
})

//dynamic routes

router                        //different get put delete combined to one route
    .route("/:id")
    .get((req,res)=>
    {
        console.log(req.user)
        res.send(`get user with id ${req.params.id}`)
    })
    .put((req,res)=>
    {
        res.send(`update user with id ${req.params.id}`)
    })
    .delete((req,res)=>
    {
        res.send(`delete user with id ${req.params.id}`)
    })

const users=[{name:"keer"},{name:"gucci"}]
router.param("id",(req,res,next,id)=>              //next is mandatory else it keeps loading infinitely
{
    req.user=users[id]
    next()
})

module.exports=router