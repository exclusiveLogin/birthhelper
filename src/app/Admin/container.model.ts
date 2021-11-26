import {IEntityItem} from './entity.model';

export interface IContainer {
  container_id_key: string;
  db_entity: string;
  db_links: string;
  db_list: string;
  entity_fields: string[];
  entity_key: string;
  name: string;
  overrided_fields: string[];
  title: string;
}

export interface ISlot {
  name: string;
  title: string;
  db_entity: string; // БД сущностей
  db_container: string; // БД контейнеров,
  db_repo: string; // БД репозитория контейнеров
  entity_fields: string[]; // поля для сущности которые показываем в информации о слоте(таблица, карточка)
  container_fields: string[]; // поля контейнера (container_repo)
  overrided_fields: string[]; // поля доступные для перекрытия
  required_fields: string[]; // поля обязательные для слота
  required_fields_type: {
    [name: string]: string,
  }; // поля обязательные для слота
  db_links: string; // БД связей
  entity_key: string; // ключ сущности
  contragent_id_key: string; // название поля для хранения ссылки на КА
  entity_id_key: string; // название поля для хранения ссылки на сущность
}

export interface IContainerData {
  id: number;
  items: {
    entity: IEntityItem,
  }[];
}
