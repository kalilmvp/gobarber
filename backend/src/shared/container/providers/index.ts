import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { container } from 'tsyringe';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import DisktStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandleBarsMailTemplateProvider from './MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';
import ICacheProvider from './CacheProvider/models/ICacheProvider';
import RedisCacheProvider from './CacheProvider/implementations/RedisCacheProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DisktStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  container.resolve(RedisCacheProvider),
);
