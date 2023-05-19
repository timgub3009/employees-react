// таким будет приходить json: статус в формате цифр, дата в формате строки
export type ErrorWithMessage = {
    status: number,
    data: {
        message: string;
    }
}