import {IFieldSetting, ILinkFieldSetting} from './form.service';
import {IContainer} from './container.model';

export interface IEntityItem {
  id: number;
  name?: string;
  title?: string;
  icon?: string;
  comment?: string;
  description?: string;
}

export interface IEntity {
  key: string;
  entities: IEntityItem[];
}

export interface ISet{
  total: string;
  fields: IFieldSetting[];
  links: ILinkFieldSetting[];
  container?: IContainer;
  slot: string;
}
