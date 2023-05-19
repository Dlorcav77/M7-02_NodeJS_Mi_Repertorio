import express from "express";
import fs from "node:fs/promises";
const app = express();

app.use(express.json());


//read
app.get("/canciones", async (req, res) => {
    const read = JSON.parse(await fs.readFile("repertorio.json", "utf-8"));
    res.json(read);
});
// insert
app.post("/canciones", async (req, res) =>{
    const {id, titulo, artista, tono} = req.body;

    if(!id || !titulo || !artista || !tono) return res.status(400).json({ok: false, msg:"Todos los campos son obligatorios"});

    const newC = {
        id, titulo, artista, tono,
    };
    const add = JSON.parse(await fs.readFile("repertorio.json", "utf-8"));
    add.push(newC);
    await fs.writeFile("repertorio.json", JSON.stringify(add))
    res.status(201).json({ok : true ,msg:"nuevo repertorio creado" ,repertorio: add});
});
// update
app.put("/canciones/:id", async (req, res)=>{
    const {id}  = req.params;
    const {titulo, artista, tono} = req.body; 

    if(!id || !titulo || !artista || !tono) return res.status(400).json({ok: false, msg:"Todos los campos son obligatorios"});

    const upd = JSON.parse(await fs.readFile("repertorio.json", "utf-8"));

    const newUpd = upd.map(item => {
        if(item.id == id){
            item.titulo = titulo;
            item.artista = artista;
            item.tono = tono;
        }
        return item;
    })
    
    await fs.writeFile("repertorio.json", JSON.stringify(newUpd))
    res.json({ ok:true, msg:"Repertorio Modificado", repertorio: newUpd});
})
// delete
app.delete("/canciones/:id", async (req, res)=>{
    const {id}  = req.params;

    if(!id) return res.status(400).json({ok: false, msg:"Seleccione id a eliminar"});

    const del = JSON.parse(await fs.readFile("repertorio.json", "utf-8"));

    const newDel = del.filter(item => item.id != id);
    await fs.writeFile("repertorio.json", JSON.stringify(newDel));
    res.json({ ok : true, msg:"Repertorio Eliminado", repertorio: newDel });
});








const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

app.listen(PORT,()=>{
    console.log("Escuchanco peticiones en el puertp: " + PORT);
});
