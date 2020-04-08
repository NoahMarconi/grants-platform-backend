import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Payout } from './Payout.model';

@Injectable()
export class PayoutService {
    constructor(@InjectModel('Payout') private readonly PayoutModel: Model<Payout>) { }

    async request(data: Payout): Promise<Payout> {
        const payout = new this.PayoutModel(data);
        let response = await payout.save();
        return response;
    }

    async getAll(): Promise<Payout[]> {
        const response = await this.PayoutModel.find()
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.PayoutModel.findOne({
            _id: id
        })
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getByGrant(grantId: string): Promise<any> {
        const response = await this.PayoutModel.find({
            grant: grantId
        })
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getByUser(userId: string): Promise<any> {
        const response = await this.PayoutModel.find({
            grantee: userId
        })
            // .populate('grantManager')
            // .populate('grantee')
            // .populate('grant')
            .exec();
        return response;
    }

    async getByGranteeAndGrant(userId: string, grantId: string): Promise<any> {
        const response = await this.PayoutModel.find({
            grantee: userId,
            grant: grantId
        })
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getByManagerAndRequest(requestId: string, managerId: string): Promise<any> {
        const response = await this.PayoutModel.findOne({
            _id: requestId,
            grantManager: managerId
        }).exec();
        return response;
    }

    async approveRequest(id: string): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(id, { status: "approved" }, { new: true });
        return response;
    }

    async rejectRequest(id: string): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
        return response;
    }

    async update(data: Payout): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async delete(id: string): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(id, { status: "delete" }, { new: true });
        return response;
    }
}