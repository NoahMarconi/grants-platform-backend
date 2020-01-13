import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var typeEnum = {
    SINGLE: "singleDeliveryDate",
    MULTIPLE: "multipleMilestones"
}

export enum EnvConfig {
    SINGLE,
    MULTIPLE
}
var currencyEnum = {
    CURRENCY: "currency",
    BLONDE: "blonde",
    BLACK: "black",
    RED: "red"
}

export enum currencyConfig {
    CURRENCY,
    BLONDE,
    BLACK,
    RED
}
export const GrantSchema = new mongoose.Schema(
    {
        grantName: { type: String, required: true },
        grantLink: { type: String, required: true },
        type: { type: typeEnum, default: typeEnum.SINGLE },
        singleDeliveryDate: {
            fundingExpiryDate: Date,
            completionDate: Date,
        },
        multipleMilestones: [
            {
                milestoneNumber: Number,
                completionDate: Date
            }
        ],
        grantManager: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        grantees: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        donors: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        grantAmount: { type: Number, required: true },
        totalFund: { type: Number, default: 0 },
        currency: { type: currencyEnum, default: currencyEnum.CURRENCY },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
)

export class grantswagger {

    @ApiProperty()
    grantName: String;
    @ApiProperty()
    grantLink: String;
    @ApiProperty()
    type: EnvConfig;
    @ApiProperty()
    singleDeliveryDate: {
        fundingExpiryDate: Date,
        completionDate: Date,
    }
    @ApiProperty()
    multipleMilestones: [
        {
            milestoneNumber: Number,
            completionDate: Date
        }
    ]
    @ApiProperty()
    grantManager: String;
    @ApiProperty()
    grantees: String;
    @ApiProperty()
    createdBy: String
    @ApiProperty()
    grantAmount: Number;
    @ApiProperty()
    totalFund: Number;
    @ApiProperty()
    currency: currencyConfig;
    @ApiProperty()
    isActive: { type: Boolean, default: true }

}

export class grantUpdateswagger {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    grantName: String;
    @ApiProperty()
    grantLink: String;
    @ApiProperty()
    type: EnvConfig;
    @ApiProperty()
    singleDeliveryDate: {
        fundingExpiryDate: Date,
        completionDate: Date,
    }
    @ApiProperty()
    multipleMilestones: [
        {
            milestoneNumber: Number,
            completionDate: Date
        }
    ]
    @ApiProperty()
    grantManager: String;
    @ApiProperty()
    grantees: String;
    @ApiProperty()
    createdBy: String
    @ApiProperty()
    grantAmount: Number;
    @ApiProperty()
    totalFund: Number;
    @ApiProperty()
    currency: currencyConfig;
    @ApiProperty()
    isActive: { type: Boolean, default: true }

}




export interface Grant extends mongoose.Document {
    _id: string;
    grantName: String;
    grantLink: string;
    type: string;
    singleDeliveryDate: object;
    multipleMilestones: [
        {
            milestoneNumber: Number,
            completionDate: Date
        }
    ];
    grantManager: [];
    grantees: [];
    donors: [];
    grantAmount: number;
    totalFund: number;
    currency: string;
    createdBy: string;
    isActive: boolean;
    createdAt: any;
}