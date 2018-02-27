package com.enthusiast94.kafkavisualizer.domain;

public class IntegerMicroType {

    public static final int EMPTY_VALUE = Integer.MIN_VALUE;
    public final int value;

    public IntegerMicroType(int value) {
        this.value = value;
    }
}
