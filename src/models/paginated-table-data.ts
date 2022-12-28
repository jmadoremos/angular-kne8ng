import { StatefulData } from './stateful-data';

export interface PaginatedTableData<T> extends StatefulData<T> {
  modified?: T;
}
