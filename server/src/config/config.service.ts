import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import { IEnvConfigInterface } from './env-config.interface';
import * as path from 'path';

@Injectable()
export class ConfigService {
    private readonly envConfig: IEnvConfigInterface;


    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = this.validateInput(config);
    }

    /*
Ensures all needed variables are set, and returns the validated JavaScript object
including the applied default values.
*/
    private validateInput(envConfig: IEnvConfigInterface): IEnvConfigInterface {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid('development', 'production')
                .default('development'),
            HTTP_PORT: Joi.number().required(),
        }).unknown(true);

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(
            envConfig,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
}

export default ConfigService;