import app from "./index.js";

const port = 3000 || 4000 || 5000;
export const server = app.listen(port, () => {
	console.log(`API escuchando en el puerto ${port}`);
});
