export class Repository<T extends class> {
    item : T;
    func() : T {
        return new T();
    }
}