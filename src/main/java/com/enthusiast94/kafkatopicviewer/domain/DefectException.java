package com.enthusiast94.kafkatopicviewer.domain;

public class DefectException extends RuntimeException {

    public DefectException(Throwable throwable) {
        super(throwable);
    }

    public DefectException(String message) {
        super(message);
    }
}
