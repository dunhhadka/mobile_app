package org.example.management.management.application.service.user;

import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.profile.Address;
import org.example.management.management.domain.profile.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public abstract class UserMapper {

    @Mapping(target = "address", ignore = true)
    abstract User toUser(UserRequest userRequest);

    abstract UserResponse toUserResponse(User user);

    abstract Address toAddressEntity(UserRequest.AddressRequest request);

    @Mapping(target = "address", ignore = true)
    abstract void updateUser(@MappingTarget User user, UserRequest userRequest);
}
