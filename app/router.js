const express = require("express");
const router = express.Router();

const {Sequelize, sequelize, Library} = require('./database/models/index')

var fs = require("fs");

var lib = [];

const updateLib = (async () => {
    try {
        lib = await Library.findAll();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
});

router.get("/", (req, res) => {
    res.render('index', {title: "homePage"});
});

router.get('/library', async (req, res) => {
    await updateLib();
    console.log(lib);
    res.render('library', {title: 'Библиотека', library: lib});
});

router.get("/library/:id", async (req, res) => {
    const id = req.params.id;
    
    if(id === "allBooks"){
        let arr = [];
        for(let book of lib){
            arr.push(book.id);
        }
        res.end(JSON.stringify(arr));
    }
    else if(id === "available"){
        let arr = [];
        for(let book of lib){
            if(book.inLibrary === "Нет"){
                arr.push(book.id);
            }
        }
        res.end(JSON.stringify(arr));
    }
    else if(id === "expired"){
        let arr = [];
        let curDate = new Date();
        for(let book of lib){
            let bookDate = new Date(book.returnDate);
            if (bookDate > curDate || book.inLibrary === "Да") {
                arr.push(book.id);
            }
        }
        res.end(JSON.stringify(arr));
    }
});

router.get("/library/book/:id", async (req, res) => {
    await updateLib();
    let book = undefined;
    for(tmp of lib){
        if(req.params.id == tmp.id){
            book = tmp;
            break;
        }
    }
    if(book){
        res.render("book", {title: "book", id: book["id"], author: book["author"],
            name: book["name"], date: book["date"], inLibrary: book["inLibrary"], 
            reader: book["reader"], returnDate: book["returnDate"], cover: book["cover"]
        }); 
    }
    else{
        res.status(404);
        res.end("err");
    }
});

router.post('/new', async (req, res) => {
    try{
        const newBook = await Library.create({ 
            name: req.body.name,
            author: req.body.author,
            date: req.body.date,
            inLibrary: "Да",
            reader: "-",
            returnDate: "-",
            cover: "default.png"
        });
    }
    catch(error){
        console.error('Ошибка при добавлении книги:', error);
    }

    res.redirect('/library');
});

router.post("/book/remove/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Library.findOne({where: {id}});
        if(book){
            if(book.cover !== "default.png"){
                fs.unlink("./public/covers/" + book.cover, () => {});
            }
            await Library.destroy({where: {id}});
        }
    }
    catch(error){
        console.error('Ошибка при удалении книги:', error);
    }

    res.redirect('/library');
});

router.post("/book/edit/:id", async (req, res) => {
    try{
        const id = req.params.id;

        let book = {
            name: req.body.name,
            author: req.body.author,
            date: req.body.date,
            cover: await Library.findOne({where: {id}}).cover
        }

        if(req.files && Object.keys(req.files).length !== 0){
            const photo = req.files.photo;
            book.cover = photo.name;
            photo.mv("./public/covers/" + photo.name);
        }

        await Library.update(book, {where: {id}});
    }
    catch(error){
        console.error('Ошибка при обновлении книги:', error);
    }

    res.redirect('/library/book/' + req.params.id);
});

router.post("/book/take/:id", async (req, res) => {
    try{
        const id = req.params.id;

        let book = {
            inLibrary: "Нет",
            reader: req.body.readerName,
            returnDate: req.body.returnDate
        }

        await Library.update(book, {where: {id}})
    }
    catch(error){
        console.error('Ошибка при взятии книги:', error);
    }

    res.redirect('/library/book/' + req.params.id);
});

router.post("/book/return/:id", async (req, res) => {
    try{
        const id = req.params.id;

        let book = {
            inLibrary: "Да",
            reader: "-",
            returnDate: "-"
        }

        await Library.update(book, {where: {id}})
    }
    catch(error){
        console.error('Ошибка при возврате книги:', error);
    }

    res.redirect('/library/book/' + req.params.id);
});

router.get("*", (req, res) => {
    res.status(404);
    res.end("err");
});
module.exports = router;