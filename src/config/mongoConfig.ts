import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (): Promise<TypegooseModuleOptions> => {
  return {
    uri: 'mongodb://0.0.0.0:27017/test',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };
};
