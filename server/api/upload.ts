import { connectDB } from '../db'
import Response from '../models/Response'

export default defineEventHandler(async (event) => {
	await connectDB()
	const body = await readBody(event)

	try {
		// const operations = body.map((item: { ErrCode: any }) => ({
		// 	updateOne: {
		// 		filter: { ErrCode: item.ErrCode },
		// 		update: { $set: item },
		// 		upsert: true,
		// 	},
		// }))
		const result = await Response.insertMany(body)
		return {
			success: true,
			data: result,
		}
	} catch (error) {
		let errorMessage = ''
		if (error instanceof Error) {
			errorMessage = error.message
		}
		return {
			success: false,
			message: errorMessage,
		}
	}
})
