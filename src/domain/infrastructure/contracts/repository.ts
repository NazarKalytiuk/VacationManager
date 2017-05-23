export interface Repository<T> {
    get(id?: any): Promise<Array<T>> | Promise<T>;
    add(item: T): Promise<T>;
    update(item: T): Promise<T>;
    delete(item: T): Promise<T>;
}