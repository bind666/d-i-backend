class ApiResponse<T = any> {
    status: boolean;
    data: T | null;
    message: string;

    constructor(data: T | null = null, message: string) {
        this.status = true;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;
