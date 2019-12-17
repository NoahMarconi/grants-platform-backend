import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";

@Injectable()
export class Guard implements CanActivate {
    excludedUrls = [
        'auth/login',
        'auth/signup'
    ];

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest();

        const url = req.url.split('/');
        const method = req.method;
        // console.log("url", url[1] + '/' + url[2]);
        // console.log("method", method);

        const token = req.headers.authorization;
        let decodeToken;
        if (token) {
            decodeToken = jwt.decode(token.replace('Bearer ', ''));
        }

        if (token && decodeToken) {
            return true;

        }

        throw new HttpException('Authorization error', HttpStatus.UNAUTHORIZED);
    }
}
