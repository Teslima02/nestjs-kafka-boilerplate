import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CORE_SERVICE,
  CORE_SERVICE_CREATE_WALLET,
  CORE_SERVICE_CREATE_WALLET_CONSUMER,
} from '../constants/constants';
import { configConstant } from '../constants/config.constant';
import { SentryModule } from '@ntegral/nestjs-sentry';
// import { LogLevel } from '@sentry/types';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from '../../kafka/kafka.module';
import {
  CREATE_WALLET_CLIENT,
  CREATE_WALLET_GROUP,
} from '../../kafka/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ConfigModule,
    KafkaModule.register({
      clientId: CREATE_WALLET_CLIENT,
      brokers: ['127.0.0.1:9092'],
      groupId: CREATE_WALLET_GROUP,
    }),
    // SentryModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     dsn: configService.get(configConstant.sentry.dns),
    //     tracesSampleRate: 1.0,
    //     debug: true,
    //     environment: 'development' || 'production',
    //     // release: 'some_release' || null, // must create a release in sentry.io dashboard
    //     logLevel: LogLevel.Debug, //based on sentry.io loglevel //
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  exports: [
    TypeOrmModule.forFeature(),
    ConfigModule,
    KafkaModule.register({
      clientId: CREATE_WALLET_CLIENT,
      brokers: ['127.0.0.1:9092'],
      groupId: CREATE_WALLET_GROUP,
    }),
    // SentryModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     dsn: configService.get(configConstant.sentry.dns),
    //     tracesSampleRate: 1.0,
    //     debug: true,
    //     environment: 'development' || 'production',
    //     // release: 'some_release' || null, // must create a release in sentry.io dashboard
    //     logLevel: LogLevel.Debug, //based on sentry.io loglevel //
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
})
export class SharedModule {}
