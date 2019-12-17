import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GrantFundTask } from './grantFundTask.model';

@Injectable()
export class GrantFundTaskService {
    constructor(@InjectModel('GrantFundTask') private readonly GrantFundTaskModel: Model<GrantFundTask>) { }

    async add(data: GrantFundTask): Promise<GrantFundTask> {
        console.log("data", data);
        const temp = new this.GrantFundTaskModel(data);
        let response = await temp.save();
        return response;
    }

    async getAll(): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({ isActive: true }).exec();
    }

    async getById(id: string): Promise<GrantFundTask> {
        return await this.GrantFundTaskModel.findOne({ _id: id, isActive: true }).exec();
    }

    async getByDonorAndGrant(grantId: string, donorId: string): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({
            donor: donorId,
            grant: grantId,
            isActive: true
        }).exec();
    }

    async getByDonor(donorId: string): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({ donor: donorId, isActive: true }).exec();
    }

    async update(data: GrantFundTask): Promise<GrantFundTask> {
        return await this.GrantFundTaskModel.findByIdAndUpdate(data._id, data, { new: true });
    }

    async delete(id): Promise<any> {
        return await this.GrantFundTaskModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    // async delete(id): Promise<any> {
    //     const response = await this.GrantFundTaskModel.findByIdAndRemove(id);
    //     return response;
    // }
}