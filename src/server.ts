import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";
import { setupRoutes } from "./routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || "8080";
export const groqAPIKey = process.env.GROQ_API_KEY;

admin.initializeApp({
	credential: admin.credential.cert("./serviceAccountKey.json"),
});

export const firestoreClient = admin.firestore();

app.use(express.json());
app.use(cors());

setupRoutes(app);

app.use((req, res) => {
	res.status(404).json({
		code: "PAGE_NOT_FOUND",
		message: `404 page not found but we good ${req.url}`,
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
