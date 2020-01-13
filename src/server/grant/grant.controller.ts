import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { GrantService } from './grant.service';
import { Grant, grantswagger, grantUpdateswagger } from './grant.model';
import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags

} from '@nestjs/swagger';
import { GrantFundService } from '../funding/grantFund.service';
import * as moment from 'moment';

@ApiTags('Grant')
@Controller('api/v1/grant')
@UseGuards(Guard)
export class GrantController {

    typeEnum = {
        SINGLE: "singleDeliveryDate",
        MULTIPLE: "multipleMilestones"
    }

    constructor(private grantService: GrantService,
        private grantFundService: GrantFundService) { }

    @Post('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Record added successfully.' })
    async add(@Res() res, @Body() grantModel: Grant, @Body() grantswagger: grantswagger) {
        try {
            // console.log("grantModel", grantModel);
            let response = await this.grantService.add(grantModel);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Record added successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve user list
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Records fetched successfully' })
    async getAll(@Res() res) {
        try {
            let response = await this.grantService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting Records', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Fetch a particular user using id
    @Get(':id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Records fetched successfully' })
    async getById(@Res() res, @Param('id') grantId) {
        try {
            let response = await this.grantService.getById(grantId);
            response = JSON.parse(JSON.stringify(response));

            if (response.type == this.typeEnum.MULTIPLE) {
                let multipleMilestones = [];

                for (let i = 0; i < response.multipleMilestones.length; i++) {
                    let data = response.multipleMilestones[i];

                    let totalFundimg = 0;
                    let fromDate: any;
                    if (i == 0) {
                        fromDate = response.createdAt;
                    } else {
                        fromDate = response.multipleMilestones[i - 1].completionDate;
                    }

                    let funding = await this.grantFundService.getBydate(grantId, fromDate, data.completionDate);
                    funding.map((temp) => {
                        totalFundimg += temp.totalFundingAmount;
                    });

                    multipleMilestones.push({
                        ...JSON.parse(JSON.stringify(data)),
                        funding: totalFundimg
                    });
                }

                response.multipleMilestones = [...multipleMilestones];
            } else {
                let totalFundimg = 0;
                let funding = await this.grantFundService.getBydate(grantId, response.createdAt, response.singleDeliveryDate.completionDate);

                funding.map((temp) => {
                    totalFundimg += temp.totalFundingAmount;
                });

                response.singleDeliveryDate = {
                    ...response.singleDeliveryDate,
                    funding: totalFundimg
                }
            }

            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('createdByMe/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Records fetched successfully' })
    async createdByMe(@Res() res, @Param('id') id) {
        try {
            // console.log("id", id);
            let response = await this.grantService.findCreatedByMe(id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('fundedByMe/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Records fetched successfully' })
    async fundedByMe(@Res() res, @Param('id') id) {
        try {
            let response = await this.grantService.findFundedByMe(id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }


    @Get('managedByMe/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Records fetched successfully' })
    async managedByMe(@Res() res, @Param('id') id) {
        try {
            // console.log("id", id);
            let response = await this.grantService.managedByMe(id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('get/getTrendingGrants')
    async getTrendingGrants(@Res() res) {
        try {
            let allGrant = await this.grantService.getTrendingGrants();

            allGrant = allGrant.sort(function (obj1, obj2) {
                if (obj1.totalFund == 0) {
                    return (obj2.totalFund / obj2.grantAmount * 100) - 0;
                }

                if (obj2.totalFund == 0) {
                    return 0 - (obj1.totalFund / obj1.grantAmount * 100);
                }

                return (obj2.totalFund / obj2.grantAmount * 100) - (obj1.totalFund / obj1.grantAmount * 100);
            });

            return res.status(httpStatus.OK).json(new APIResponse(allGrant, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Update a user's details
    @Put('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Records updated successfully' })
    async update(@Res() res, @Body() userModel: Grant, @Body() grantUpdateswagger: grantUpdateswagger) {
        try {
            let response = await this.grantService.update(userModel);
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
    @ApiResponse({ status: 200, description: 'Records deleted successfully' })
    async delete(@Res() res, @Param('id') id) {
        try {
            let response = await this.grantService.delete(id);
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