import {
    Controller, Get, Res, HttpStatus, Req, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards, UseInterceptors, UploadedFile,

} from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');

import { UserService } from './user.service';
import { User, userswagger , FileUploadDto } from './user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, 
         ApiParam,
         ApiHeader,
         ApiBearerAuth,
         ApiConsumes,
         ApiBody,
         ApiTags
         
 } from '@nestjs/swagger';
var multer = require("multer");

@ApiTags('User')
@Controller('api/v1/user')
@UseGuards(Guard)
export class UserController {

    constructor(public userService: UserService) { }
    @ApiParam({name: 'id', type: String,required: true})
    @Post('/uploadProfile/:id')
    @ApiResponse({ status: 200, description: 'User added successfully.' })
    @UseInterceptors(
        FileInterceptor('profile', {
            storage: multer.diskStorage({
                destination: 'files/',
                filename: (req, file, cb) => {
                    const extension = file.originalname.split('.');
                    const filename = `${Date.now()}.${extension[extension.length - 1]}`;
                    return cb(null, filename)
                }
            })
        })
    )
@ApiConsumes('multipart/form-data')
@ApiBearerAuth()
@ApiBody({
  description: 'List of files',
  type: FileUploadDto,
})
    async uploadProfile(@Res() res, @UploadedFile() file, @Body() userswagger: userswagger, @Param('id') id) {
        try {
            // `${file.path.replace(/\\/g, '/')}`
            // console.log("file", file);
            let response = await this.userService.uploadProfile(id, file.filename);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'User added successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve user list
    @Get('getAll')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async getAll(@Res() res) {
        try {
            // console.log("get All")
            let response = await this.userService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting Records', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Fetch a user BY id
    @Get(':id')
    @ApiBearerAuth()
    @ApiParam({name: 'id', type: String})
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async getById(@Res() res,  @Param('id') id) {
        try {
            let response = await this.userService.getById(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('searchUser/search/:name*?')
    @ApiBearerAuth()
    @ApiParam({name: 'name', type: String})
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async searchUser(@Res() res, @Param('name') name = '') {
        try {
            let response = await this.userService.searchByUser(name);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Update a user's details
    @Put('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Records updated succesfully.' })
    async update(@Res() res, @Body() userswagger: userswagger, @Body() userModel: User) {
        try {
            let response = await this.userService.update(userModel);
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
    @ApiParam({name: 'id', type: String})
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Record deleted successfully.' })
    async delete(@Res() res, @Param('id') id) {
        try {
            let response = await this.userService.delete(id);
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