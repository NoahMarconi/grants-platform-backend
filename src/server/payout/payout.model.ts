import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECT: "reject",
    DELETE: "delete"
}

export const PayoutSchema = new mongoose.Schema(
    {
        grantManager: { type: Schema.Types.ObjectId, ref: "User", required: true },
        grantee: { type: Schema.Types.ObjectId, ref: "User", required: true },
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        requestAmount: { type: Number, required: true },
        status: { type: statusEnum, default: statusEnum.PENDING }
    },
    { timestamps: true }
)


export interface Payout extends mongoose.Document {
    grantManager: string,
    grantee: string,
    grant: string,
    requestAmount: number
}