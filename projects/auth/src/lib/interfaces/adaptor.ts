export interface Adaptor<T = any, R = any> {
    adapt(data: T): R;
}
