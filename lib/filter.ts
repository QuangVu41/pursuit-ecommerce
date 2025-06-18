import { PrismaClient } from '@prisma/client';
import { RECORDS_PER_PAGE } from './constants';
import { db } from './db';

interface BaseFindManyArgs<T> {
  skip?: number;
  take?: number;
  where?: T[keyof T];
  orderBy?: T[keyof T];
  include?: T[keyof T];
  count?: number;
}

class FilterApi<M, T> {
  private query: BaseFindManyArgs<T>;

  constructor(private model: keyof PrismaClient, private searchParams: { [key: string]: string }) {
    this.query = {};
  }

  where(where?: T[keyof T]) {
    this.query.where = where;

    return this;
  }

  sort() {
    const { order, sortBy } = this.searchParams;
    if (sortBy && order) {
      this.query.orderBy = { [sortBy]: order } as any;
    } else {
      this.query.orderBy = { createdAt: 'desc' } as any;
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.searchParams.page) || 1;
    const skip = (page - 1) * RECORDS_PER_PAGE;
    this.query.skip = skip;
    this.query.take = RECORDS_PER_PAGE;

    return this;
  }

  async count() {
    this.query.count = await (db[this.model] as any).count({ where: this.query.where });

    return this;
  }

  include(include?: T[keyof T]) {
    this.query.include = include;

    return this;
  }

  async execute() {
    const data = (await (db[this.model] as any).findMany(this.query)) as M[];
    const count = (await this.count()).query.count!;
    return { data, count };
  }
}

export default FilterApi;
