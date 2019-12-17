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
        const response = await this.GrantModel.find({ isActive: true })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .exec();
        return response;
    }

    async getById(id: string): Promise<Grant> {
        const response = await this.GrantModel.findOne({ _id: id, isActive: true })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .exec();
        return response;
    }

    async findCreatedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ createdBy: id, isActive: true })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .exec();
        return response;
    }

    // async findFundedByMe(id: string): Promise<Grant[]> {
    //     const response = await this.GrantModel.find({ grantees: { $in: [id] }, isActive: true })
    //         .populate('grantManager')
    //         .populate('grantees')
    //         .populate('createdBy')
    //         .exec();
    //     return response;
    // }

    async getTrendingGrants() {
        const response = await this.GrantModel.find({ isActive: true })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .exec();
        return response;
    }

    async managedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ grantManager: id, isActive: true })
            .populate('grantManager')
            .populate('grantees')
            .populate('createdBy')
            .exec();
        return response;
    }

    async update(data: Grant): Promise<Grant> {
        const response = await this.GrantModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async delete(id): Promise<any> {
        const response = await this.GrantModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return response;
    }

    // async delete(id): Promise<any> {
    //     const response = await this.GrantModel.findByIdAndRemove(id);
    //     return response;
    // }
}