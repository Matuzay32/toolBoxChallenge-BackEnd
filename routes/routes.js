import axios from "axios";
import { Router } from "express";
import csv from "csvtojson";
const router = Router();

router.get("/files/data", async (req, res) => {
	try {
		const config = {
			headers: {
				Authorization: "Bearer aSuperSecretKey",
			},
		};
		const filesResponse = await axios.get(
			"https://echo-serv.tbxnet.com/v1/secret/files",
			config
		);
		const files = filesResponse.data.files;
		const fileObjects = [];
		for (const file of files) {
			try {
				const fileRes = await axios.get(
					`https://echo-serv.tbxnet.com/v1/secret/file/${file}`,
					config
				);
				const fileContent = fileRes.data;
				const lines = await csv().fromString(
					fileContent
				);
				function validateLine(line, file) {
					// Validar el nombre del archivo
					if (line.file !== file) {
						console.error(
							`Invalid file name in file ${file}`
						);
						return false;
					}
					// Validar el texto
					if (typeof line.text !== "string") {
						console.error(
							`Invalid text format in file ${file}`
						);
						return false;
					}
					// Validar el número
					if (isNaN(line.number)) {
						console.error(
							`Invalid number format in file ${file}`
						);
						return false;
					}
					// Validar el hexadecimal
					if (!/^[0-9a-fA-F]{32}$/.test(line.hex)) {
						console.error(
							`Invalid hex format in file ${file}`
						);
						return false;
					}
					return true;
				}
				const validLines = lines.filter((line) => {
					if (validateLine(line, file)) {
						return true;
					} else {
						console.error(
							`Invalid line format in file ${file}`
						);
						return false;
					}
				});
				const fileObject = {
					file,
					lines: validLines.map((line) => {
						return {
							text: line.text,
							number: line.number,
							hex: line.hex,
						};
					}),
				};
				fileObjects.push(fileObject);
			} catch (error) {
				console.error(
					`Error processing file ${file}: ${error.message}`
				);
			}
		}

		res.status(200).json(fileObjects);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/files/list", async (req, res) => {
	try {
		const config = {
			headers: {
				Authorization: "Bearer aSuperSecretKey",
			},
		};
		const fileRes = await axios.get(
			"https://echo-serv.tbxnet.com/v1/secret/files",
			config
		);
		let files = fileRes.data.files;
		if (req.query.fileName) {
			files = files.filter(
				(file) => file === req.query.fileName
			);
		}
		const fileObjects = [];
		for (const file of files) {
			try {
				const fileResponse = await axios.get(
					`https://echo-serv.tbxnet.com/v1/secret/file/${file}`,
					config
				);
				const fileContent = fileResponse.data;
				// procesar el contenido del archivo como un CSV
				const lines = await csv().fromString(
					fileContent
				);
				//verifica que cumpla con las condiciones para despues filtrar el obj
				function validateLine(line, file) {
					// Validar el nombre del archivo
					if (line.file !== file) {
						console.error(
							`Invalid file name in file ${file}`
						);
						return false;
					}
					// Validar el texto
					if (typeof line.text !== "string") {
						console.error(
							`Invalid text format in file ${file}`
						);
						return false;
					}
					// Validar el número
					if (isNaN(line.number)) {
						console.error(
							`Invalid number format in file ${file}`
						);
						return false;
					}
					// Validar el hexadecimal
					if (!/^[0-9a-fA-F]{32}$/.test(line.hex)) {
						console.error(
							`Invalid hex format in file ${file}`
						);
						return false;
					}
					return true;
				}
				const validLines = lines.filter((line) => {
					if (validateLine(line, file)) {
						return true;
					} else {
						console.error(
							`Invalid line format in file ${file}`
						);
						return false;
					}
				});
				// crear el objeto JSON para el archivo con solo las líneas válidas
				const fileObject = {
					file,
					lines: validLines.map((line) => {
						return {
							text: line.text,
							number: line.number,
							hex: line.hex,
						};
					}),
				};
				fileObjects.push(fileObject);
			} catch (error) {
				console.error(
					`Error processing file ${file}: ${error.message}`
				);
			}
		}
		// responder con el array de objetos JSON
		res.json(fileObjects);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
