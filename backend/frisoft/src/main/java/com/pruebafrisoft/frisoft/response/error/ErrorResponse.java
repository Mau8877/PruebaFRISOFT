package com.pruebafrisoft.frisoft.response.error;

public record ErrorResponse(String status, String code, String message) {

	private static final String STATUS_FAIL = "fail";

	public static ErrorResponse of(String code, String message) {
		return new ErrorResponse(STATUS_FAIL, code, message);
	}

	public static ErrorResponse of(ErrorType errorType) {
		return new ErrorResponse(STATUS_FAIL, errorType.getCode(), errorType.getMessage());
	}

}
