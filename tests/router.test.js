import { expect } from "chai";
import request from "supertest";
import app from "../index.js";

//Este test funciona para la ruta /files/data
describe("GET /files/data", () => {
	it("should return an array of file objects", (done) => {
		request(app)
			.get("/files/data")
			.end((err, res) => {
				if (err) {
					console.log(err);
					return done(err);
				}
				if (
					res.body === null ||
					res.body === undefined
				) {
					return done(
						Error("body is null or undefined")
					);
				}
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.be.an("array");

				done();
			});
	});
});

//Este test funciona para la ruta /files/list
describe("GET /files/list", () => {
	it("should return an array of file objects", (done) => {
		request(app)
			.get("/files/list")
			.end((err, res) => {
				if (err) {
					console.log(err);
					return done(err);
				}
				if (
					res.body === null ||
					res.body === undefined
				) {
					return done(
						Error("body is null or undefined")
					);
				}
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.be.an("array");

				done();
			});
	});
});
