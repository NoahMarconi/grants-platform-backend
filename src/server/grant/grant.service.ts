import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Grant } from './grant.model';

@Injectable()
export class GrantService {
    constructor(@InjectModel('Grant') private readonly GrantModel: Model<Grant>) { }

    async add(data: Grant): Promise<Grant> {
        const grant = new this.GrantModel(data);
        let response = await grant.save();
        return response;
    }

    async getAll(): Promise<Grant[]> {
        const response = await this.GrantModel.find({ status: "active" })
            .populate('grantManager')
            .populate('grantees.grantee')
            .populate('createdBy')
            .populate('donors')
            .sort({ createdAt: -1 })
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.GrantModel.findOne({ _id: id })
            .populate('grantManager')
            .populate('createdBy')
            .populate('donors')
            .populate('grantees.grantee')
            .exec();
        return response;
    }

    async getForFunding(grantId: string, donor: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grantId,
            grantManager: { $ne: donor },
            grantees: { $elemMatch: { grantee: { $ne: donor } } },
            status: "active"
        })
            .exec();
        return response;
    }

    async getByIdAndManager(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grant,
            status: "active",
            grantManager: user
        }).exec();
        return response;
    }

    async getByIdAndDonorAndGrantee(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grant,
            status: "active",
            $or: [{
                grantees: { $elemMatch: { grantee: user } }
            }, {
                donors: { $in: [user] }
            }]
        })
            .exec();
        return response;
    }

    async findCreatedByMe(id: string): Promise<any> {
        const response = await this.GrantModel.find({ createdBy: id })
            .populate('grantManager')
            .populate('grantees.grantee')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async findFundedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ donors: { $in: [id] } })
            .populate('grantManager')
            .populate('grantees.grantee')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async managedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ grantManager: id })
            .populate('grantManager')
            .populate('grantees.grantee')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async getByManagerAndGrant(grantId: string, managerId: string): Promise<Grant> {
        const response = await this.GrantModel.findOne({
            _id: grantId,
            grantManager: managerId
        }).exec();
        return response;
    }

    async update(data: Grant): Promise<Grant> {
        const response = await this.GrantModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async cancel(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findByIdAndUpdate(
            grant,
            {
                status: "cancel",
                cancelBy: user
            },
            { new: true }
        );
        return response;
    }

    // async delete(id): Promise<any> {
    //     const response = await this.GrantModel.findByIdAndRemove(id);
    //     return response;
    // }
}