import Response from '../models/Response'
import { connectDB } from '../db'

export default defineEventHandler(async (event) => {
	await connectDB()
	const responses = await Response.find({})
	return responses
})
