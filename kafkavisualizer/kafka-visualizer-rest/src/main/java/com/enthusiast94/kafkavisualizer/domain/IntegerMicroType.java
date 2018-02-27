package com.enthusiast94.kafkavisualizer.domain;

import java.util.Objects;

public class IntegerMicroType {

    public static final int EMPTY_VALUE = Integer.MIN_VALUE;
    public final int value;

    public IntegerMicroType(int value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IntegerMicroType that = (IntegerMicroType) o;
        return value == that.value;
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return "IntegerMicroType{" +
                "value=" + value +
                '}';
    }
}
