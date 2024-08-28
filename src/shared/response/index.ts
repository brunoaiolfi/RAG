export class Response {
    public success: boolean;
    public message: string;
    public content: any;

    constructor(success: boolean, data: any, message: string = '') {
        this.success = success;
        this.message = message;
        this.content = data;
    }

    
}