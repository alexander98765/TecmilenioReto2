import { TypeOrmModuleOptions } from '@nestjs/typeorm'; 

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions { 
    console.log("MYYYYYY " + this.getValue('TUTORIAL_DATABASE'))
    return {
      type: 'mysql', 

      host: this.getValue('TUTORIAL_HOST'), 
      port: parseInt(this.getValue('TUTORIAL_PORT')),
      username: this.getValue('TUTORIAL_USER'),
      password: this.getValue('TUTORIAL_PASSWORD'),
      database: this.getValue('TUTORIAL_DATABASE'),

      entities: ["dist/**/*.entity{.ts,.js}"], 
      synchronize: false, 
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'TUTORIAL_HOST',
  'TUTORIAL_PORT',
  'TUTORIAL_USER',
  'TUTORIAL_PASSWORD',
  'TUTORIAL_DATABASE',
]);

export { configService };