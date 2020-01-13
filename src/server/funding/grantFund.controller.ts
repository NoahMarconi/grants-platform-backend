import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { GrantFundService } from './grantFund.service';
import { GrantFund, grantswagger } from './grantFund.model';
import { GrantService } from '../grant/grant.service';
import { GrantFundTaskService } from './grantFundTask.service';
import { GrantFundTask } from './grantFundTask.model';
import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags
} from '@nestjs/swagger';

@ApiTags('GrantFund')
@Controller('api/v1/grantFund')
@UseGuards(Guard)
export class GrantFundController {
    constructor(private grantFundService: GrantFundService,
        private grantFundTaskService: GrantFundTaskService,
        private grantService: GrantService) { }

    @Post('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Fund added successfully.' })
    async add(@Res() res, @Body() GrantFundTaskModel: GrantFundTask) {
        try {
            let grantData = await this.grantService.getById(GrantFundTaskModel.grant);
            // console.log('grand data', grantData);
            if (grantData) {
                let grantFund = await this.grantFundService.getByDonorAndGrant(GrantFundTaskModel.grant, GrantFundTaskModel.donor);
                if (grantFund) {

                    grantFund.totalFundingAmount += +GrantFundTaskModel.fundingAmount;
                    grantData.totalFund += +GrantFundTaskModel.fundingAmount;

                    let promise = [];
                    promise.push(this.grantFundTaskService.add(GrantFundTaskModel));
                    promise.push(this.grantFundService.update(grantFund));
                    promise.push(this.grantService.update(grantData));

                    let response = await Promise.all(promise);

                    return res.status(httpStatus.OK).json(new APIResponse(response[1], 'Fund added successfully', httpStatus.OK));
                } else {
                    let grantFundModele = [];
                    grantFundModele["grant"] = GrantFundTaskModel.grant;
                    grantFundModele['donor'] = GrantFundTaskModel.donor;
                    grantFundModele["totalFundingAmount"] = GrantFundTaskModel.fundingAmount;

                    grantData.totalFund += +GrantFundTaskModel.fundingAmount;
                    grantData.donors.push(GrantFundTaskModel.donor);

                    let promise = [];
                    promise.push(this.grantFundTaskService.add(GrantFundTaskModel));
                    promise.push(this.grantFundService.add(grantFundModele));
                    promise.push(this.grantService.update(grantData));

                    let response = await Promise.all(promise);

                    return res.status(httpStatus.OK).json(new APIResponse(response[1], 'Fund added successfully', httpStatus.OK));
                }
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Grant not Found', httpStatus.BAD_REQUEST));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve user list
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async getAll(@Res() res) {
        try {
            let response = await this.grantFundService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting Records', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Fetch a particular user using id
    @Get(':id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async getById(@Res() res, @Param('id') id) {
        try {
            let response = await this.grantFundService.getById(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('fundedByMe/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'funded By me.' })
    async fundedByMe(@Res() res, @Param('id') id) {
        try {
            // console.log("id", id);
            let response = await this.grantFundService.getByDonor(id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('myFundingTask/:id')
    async myFundingTask(@Res() res, @Param('id') id) {
        try {
            // console.log("id", id);
            let response = await this.grantFundTaskService.getByDonor(id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Update a user's details
    @Put('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'fund updated succesfully.' })
    async update(@Res() res, @Body() GrantFundModel: GrantFund, @Body() grantswagger: grantswagger) {
        try {
            let response = await this.grantFundService.update(GrantFundModel);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Records updated succesfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Delete a user
    @Delete(':id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'fund deleted successfully.' })
    async delete(@Res() res, @Param('id') id) {
        try {
            let response = await this.grantFundService.delete(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(null, 'Record deleted successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error deleting  Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}