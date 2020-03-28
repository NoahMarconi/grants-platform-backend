import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    ACTIVE: "active",
    CANCEL: "cancel"
}

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
        grantManager: { type: Schema.Types.ObjectId, ref: "User", required: true },
        grantees: [
            {
                grantee: { type: Schema.Types.ObjectId, ref: "User", required: true },
                allocationAmount: { type: Number, required: true },
                payedAmount: { type: Number, default: 0 }
            }
        ],
        donors: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        targetFunding: { type: Number, required: true },
        totalFunding: { type: Number, default: 0 },
        totalPayed: { type: Number, default: 0 },
        currency: { type: currencyEnum, default: currencyEnum.CURRENCY },
        cancelBy: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: statusEnum, default: statusEnum.ACTIVE },
        contractId: { type: String, required: true },
        content: { type: String }
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
    grantees: [
        {
            grantee: String,
            allocationAmount: Number,
            payedAmount: Number
        }
    ];
    @ApiProperty()
    createdBy: String
    @ApiProperty()
    targetFunding: Number;
    @ApiProperty()
    totalFunding: Number;
    @ApiProperty()
    totalPayed: Number;
    @ApiProperty()
    currency: currencyConfig;
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
    grantees: [
        {
            grantee: String,
            allocationAmount: Number,
            payedAmount: Number
        }
    ];
    @ApiProperty()
    createdBy: String
    @ApiProperty()
    targetFunding: Number;
    @ApiProperty()
    totalFunding: Number;
    @ApiProperty()
    totalPayed: Number;
    @ApiProperty()
    currency: currencyConfig;
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
    grantManager: String;
    grantees: [
        {
            grantee: String,
            allocationAmount: Number,
            payedAmount: Number
        }
    ];
    donors: [];
    targetFunding: number;
    totalFunding: number;
    totalPayed: Number;
    currency: string;
    createdBy: string;
    cancelBy: string;
    status: string;
    content: string;
    contractId: string;
    createdAt: any;
}