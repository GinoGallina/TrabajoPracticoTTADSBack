export interface IResponse<T> {
    data: null | T ,
    message:string[],
    success:boolean
}