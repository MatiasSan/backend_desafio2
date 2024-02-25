import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.get('/', (req, res) => {
  res.sendFile(path.join(dirname, 'index.html'));
});

app.post("/canciones", (req, res) => {
    try {
        const cancion = req.body
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"))
        canciones.push(cancion)
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
        res.send("Canción agregada exitosamente!")
    } catch (error) {
        console.error("Error al agregar la canción:", error)
        res.status(500).send("Error al agregar la canción")
    }
});

app.get("/canciones", (req, res) => {
    try {
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        res.json(canciones);
    } catch (error) {
        console.error("Error al obtener las canciones:", error);
        res.status(500).send("Error al obtener las canciones");
    }
});

// Made Ricardo Moena
app.put("/canciones/:id", (req, res) => {
    try {
        const {id} = req.params 
        const cancion = req.body;
        const canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        const index = canciones.findIndex(c => c.id == id);
        canciones[index]= cancion
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
        res.send("cancion modificada con éxito")

    } catch (error) {
        console.error("Error al actualizar la canción:", error);
        res.status(500).send("Error al actualizar la canción");
    }
});

app.delete("/canciones/:id", (req, res) => {
    try {
        const id = req.params.id;
        let canciones = JSON.parse(fs.readFileSync("repertorio.json"));
        canciones = canciones.filter(c => c.id !== id);
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
        res.send("Canción eliminada exitosamente!");
    } catch (error) {
        console.error("Error al eliminar la canción:", error);
        res.status(500).send("Error al eliminar la canción");
    }
});

app.listen(PORT, console.log('¡Servidor encendido!'));