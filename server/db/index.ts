import mongoose, { modelNames } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
	const mongoUri = process.env.MONGO_URI

	if (!mongoUri) {
		throw new Error('MONGO_URI is not defined in the environment variables.')
	}

	try {
		await mongoose.connect(mongoUri, {
			//   useNewUrlParser: true,
			//   useUnifiedTopology: true,
		})
		console.log('MongoDB connected')
	} catch (error) {
		console.error('MongoDB connection error:', error)
		process.exit(1)
	}
}
