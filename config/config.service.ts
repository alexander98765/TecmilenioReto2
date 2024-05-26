import { TypeOrmModuleOptions } from '@nestjs/typeorm'; 

require('dotenv').config();

class ConfigService {
  
  /**
   * Constructor of class
   *
   * @param env - env file where DB connection details are kept
   *
  */
  constructor(private env: { [k: string]: string | undefined }) {}

  /**
   * This function gets a DB connection value with the given key. 
   *
   * @param key - string with key to be read
   * @param throwOnMissing - boolean to raise exception if connection value  is empty. True by default.
   *
   * @returns A DB connection value 
  */
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * This function manages the obtaining of DB connection values.
   *
   * @param keys - string array with keys to be read
   *
   * @returns An object of type string with the DB connection values values 
  */
  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  /**
   * This function manages the obtaining of DB connection values, every property is read by its key.
   * 
   * @remarks
   * Entities are read from dist folder to make the code-DB mapping
   * Syncronize is false so typeorm does not create tables automatically.
   *
   * @returns An object of type string with the DB connection values values 
  */
  public getTypeOrmConfig(): TypeOrmModuleOptions { 
    return {
      type: 'mysql', 

      host: this.getValue('TUTORIAL_HOST'), 
      port: parseInt(this.getValue('TUTORIAL_PORT')),
      username: this.getValue('TUTORIAL_USER'),
      password: this.getValue('TUTORIAL_PASSWORD'),
      database: this.getValue('TUTORIAL_DATABASE'),

      entities: ["dist/**/*.entity{.ts,.js}"], 
      synchronize: false 
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