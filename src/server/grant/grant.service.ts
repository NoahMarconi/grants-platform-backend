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
            .populate('grantees')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.GrantModel.findOne({ _id: id })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async getForFunding(id: string, donor: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: id,
            status: "active",
            grantManager: { $nin: [donor] },
            grantees: { $nin: [donor] }
        })
            .exec();
        return response;
    }

    async getByIdAndManager(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grant,
            status: "active",
            grantManager: { $in: [user] }
        }).exec();
        return response;
    }

    async getByIdAndDonorAndGrantee(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grant,
            status: "active",
            $or: [{
                grantees: { $in: [user] }
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
            .populate('grantees')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async findFundedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ donors: { $in: [id] } })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .populate('donors')
            .exec();
        return response;
    }

    async managedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ grantManager: id })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .populate('donors')
            .exec();
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