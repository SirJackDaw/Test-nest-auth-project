import { Injectable } from "@nestjs/common";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { InjectModel } from "nestjs-typegoose";
import { RefreshModel } from './refresh.model';

@Injectable()
export class RefreshService {
    constructor(@InjectModel(RefreshModel) private readonly refreshModel: ModelType<RefreshModel>) {}

    async addToken(userId): Promise<string> {
        const oldToken = await this.refreshModel.findOne({ userId }).exec()
        if (!oldToken) {
            this.refreshModel.create(userId)
        }
        return 'ggg'
    }

    async getToken(userId) {

    }
}
