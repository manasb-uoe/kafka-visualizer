package com.enthusiast94.kafkatopicviewer.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class HttpResponseFactory {

    private final Gson gson = new Gson();

    public <T> ResponseEntity<String> createOkResponse(T body) {
        return new ResponseEntity<>(gson.toJson(body), HttpStatus.OK);
    }

    public ResponseEntity<String> createInternalServerErrorResponse(String errorMessage) {
        return new ResponseEntity<>(createErrorJsonString(errorMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> create404ErrorResponse(String errorMessage) {
        return new ResponseEntity<String>(createErrorJsonString(errorMessage), HttpStatus.NOT_FOUND);
    }

    private String createErrorJsonString(String errorMessage) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("error", errorMessage);
        return gson.toJson(jsonObject);
    }
}
