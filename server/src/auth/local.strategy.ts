import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { LecturerService } from 'src/services/lecturer.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly lecturerService: LecturerService,
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
                secretOrKey: 'secret',
            }
        );
    }

    async validate(payload: any) {
        // const user = await this.lecturerService.read(payload);
        return payload;
    }
}