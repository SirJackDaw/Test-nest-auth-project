import {ApiProperty} from "@nestjs/swagger";

export class ErrorWithMessage {
    @ApiProperty()
    errorCode: number;

    @ApiProperty()
    errorMessage: string;
}