import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { LecturerService } from '../services/lecturer.service';
import { JwtService } from '@nestjs/jwt';
import { LecturerRO } from 'src/dto/lecturer.response.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => LecturerService))
        private lecturerService: LecturerService,
        private readonly jwtService: JwtService,
    ) { }

    async login(data: any) {
        const user = await this.lecturerService.validateUser(data);
        // console.log(JSON.stringify(user));
        const payload = { email: user.email, sub: user.id };
        // console.log(JSON.stringify(payload));
        return {
            id: user.id,
            email: user.email,
            names: user.names,
            curriculum: user.curriculum,
            courses: user.courses,
            access_token: this.jwtService.sign(payload),
        } as LecturerRO;
    }

    jwtSign(payload: any): string {
        return this.jwtService.sign(payload);
    }
}
