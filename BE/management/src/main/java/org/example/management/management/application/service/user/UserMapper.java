package org.example.management.management.application.service.user;

import org.example.management.management.application.model.images.ImageResponse;
import org.example.management.management.application.model.user.request.UserRequest;
import org.example.management.management.application.model.user.response.UserResponse;
import org.example.management.management.domain.profile.Address;
import org.example.management.management.domain.profile.User;
import org.example.management.management.domain.task.Image;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public abstract class UserMapper {

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    abstract User toUser(UserRequest userRequest);

    abstract UserResponse toUserResponse(User user);

    abstract Address toAddressEntity(UserRequest.AddressRequest request);

    @BeanMapping(unmappedTargetPolicy = ReportingPolicy.IGNORE)
    abstract void updateUser(@MappingTarget User user, UserRequest userRequest);

    abstract ImageResponse toImageResponse(Image image);

    UserResponse toUserResponse(User user, Image image) {
        var userResponse = this.toUserResponse(user);
        if (image != null) {
            userResponse.setAvatar(toImageResponse(image));
        }
        return userResponse;
    }

}
