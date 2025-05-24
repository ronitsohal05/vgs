package com.vgs.backend.repository;

import com.vgs.backend.model.Listing;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ListingRepository extends MongoRepository<Listing, String> {
    
    
    List<Listing> findBySchoolId(String schoolId);

    List<Listing> findByOwnerIdAndSchoolId(String ownerId, String schoolId);
    
    Optional<Listing> findByIdAndOwnerIdAndSchoolId(
        String id,
        String ownerId,
        String schoolId
    );
}
