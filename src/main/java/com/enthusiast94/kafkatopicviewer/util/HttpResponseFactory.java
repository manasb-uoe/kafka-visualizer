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
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("error", errorMessage);
        return new ResponseEntity<>(gson.toJson(jsonObject), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
