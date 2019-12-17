import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var statusEnum = {
    ACTIVE: "active"
}

export const GrantFundTaskSchema = new mongoose.Schema(
    {
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
        fundingAmount: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
)

export interface GrantFundTask extends mongoose.Document {
    _id: string;
    grant: string;
    donor: string;
    fundingAmount: number;
    isActive: boolean;
}