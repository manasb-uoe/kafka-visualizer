package com.enthusiast94.kafkatopicviewer.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class HttpResponseFactory {

    private final Gson gson = new Gson();

    public <T> ResponseEntity<String> createOkResponse(T body) {
        return new ResponseEntity<String>(gson.toJson(body), HttpStatus.OK);
    }

    public ResponseEntity<JsonObject> createInternalServerErrorResponse(String errorMessage) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("error", errorMessage);
        return new ResponseEntity<JsonObject>(jsonObject, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
