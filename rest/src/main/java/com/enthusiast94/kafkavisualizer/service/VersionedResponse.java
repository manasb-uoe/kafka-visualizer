package com.enthusiast94.kafkavisualizer.service;

import java.util.Objects;

public class VersionedResponse<T> {
    public final long version;
    public final T data;

    public VersionedResponse(long version, T data) {
        this.version = version;
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VersionedResponse<?> that = (VersionedResponse<?>) o;
        return version == that.version &&
                Objects.equals(data, that.data);
    }

    @Override
    public int hashCode() {
        return Objects.hash(version, data);
    }

    @Override
    public String toString() {
        return "VersionedResponse{" +
                "version=" + version +
                ", data=" + data +
                '}';
    }
}
