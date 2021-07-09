import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RefreshService } from './refresh.service';
import { RefreshModel } from './refresh.model';

@Module({
    imports: [
        TypegooseModule.forFeature([
            {
              typegooseClass: RefreshModel,
              schemaOptions: {
                collection: 'RefreshToken',
              },
            },
          ]),
    ],
    providers: [RefreshService],
    exports: [RefreshService]
})
export class RefreshModule { }
