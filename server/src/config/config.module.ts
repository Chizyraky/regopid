import { ConfigService } from './config.service';
import { Module } from '@nestjs/common';

@Module({
    // imports: [],
    // controllers: [],
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(`env/${process.env.NODE_ENV || 'development'}.env`),
        }
    ],
    exports: [ConfigService],
})
export class ConfigModule { }
