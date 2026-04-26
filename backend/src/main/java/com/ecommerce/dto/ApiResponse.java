package com.ecommerce.dto;

public class ApiResponse<T> {

    private boolean success;
    private String  message;
    private T       data;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data    = data;
    }

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = "Success";
        r.data    = data;
        return r;
    }

    public static <T> ApiResponse<T> ok(String msg, T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = true;
        r.message = msg;
        r.data    = data;
        return r;
    }

    public static <T> ApiResponse<T> error(String msg) {
        ApiResponse<T> r = new ApiResponse<>();
        r.success = false;
        r.message = msg;
        r.data    = null;
        return r;
    }

    public boolean isSuccess()  { return success; }
    public String getMessage()  { return message; }
    public T getData()          { return data; }

    public void setSuccess(boolean success) { this.success = success; }
    public void setMessage(String message)  { this.message = message; }
    public void setData(T data)             { this.data = data; }
}
