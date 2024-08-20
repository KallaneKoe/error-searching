import mongoose, { trusted } from 'mongoose'

const responseSchema = new mongoose.Schema(
	{
		Player: { type: String },
		ErrCode: { type: String },
		ErrMessage: { type: String },
		Cause: { type: String },
		CustomerSolution: { type: String },
		DeveloperSolution: { type: String },
		Note: { type: String },
		Platform: { type: String },
	},
	{
		versionKey: false,
	}
)

const Response = mongoose.model('QnA', responseSchema)
export default Response
