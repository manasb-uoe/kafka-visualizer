package com.enthusiast94.kafkatopicviewer.util;

import com.google.common.collect.ImmutableList;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

public class ImmutableListGsonDeserializer implements JsonDeserializer<ImmutableList<?>> {

    @Override
    public ImmutableList<?> deserialize(JsonElement jsonElement,
                                        Type type,
                                        JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        Type type2 = ParameterizedTypeImpl.make(List.class, ((ParameterizedType) type).getActualTypeArguments(), null);
        List<?> list = jsonDeserializationContext.deserialize(jsonElement, type2);
        return ImmutableList.copyOf(list);
    }
}
