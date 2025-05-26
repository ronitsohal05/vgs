package com.vgs.backend.controller;

import com.vgs.backend.model.Listing;
import com.vgs.backend.repository.ListingRepository;
import com.vgs.backend.service.S3Service;
import com.vgs.backend.util.JwtUtil;
import com.vgs.backend.util.SlugUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/listings")
public class ListingController {

    private final JwtUtil jwtUtil;
    private final S3Service s3Service;
    private final ListingRepository listingRepository;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public ListingController(JwtUtil jwtUtil,
                             S3Service s3Service,
                             ListingRepository listingRepository) {
        this.jwtUtil = jwtUtil;
        this.s3Service = s3Service;
        this.listingRepository = listingRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Listing createListing(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam("images") List<MultipartFile> images,
            @RequestParam(value = "tags", required = false) List<String> tags
    ) {
        if (images.size() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot upload more than 5 images");
        }

        // extract and parse JWT
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String email = claims.getSubject();
        String university = claims.get("university", String.class);
        String slug = SlugUtil.slugify(university);

        // upload each image under "<slug>/..."
        List<String> urls = new ArrayList<>();
        for (MultipartFile image : images) {
            String filename = UUID.randomUUID() + "-" + image.getOriginalFilename();
            String key = slug + "/" + filename;
            String url = s3Service.uploadFile(image, key);
            urls.add(url);
        }

        // build and save listing
        Listing listing = new Listing();
        listing.setTitle(title);
        listing.setDescription(description);
        listing.setPrice(price);
        listing.setOwnerId(email);
        listing.setSchoolId(university);
        listing.setImageUrls(urls);
        listing.setTags(tags != null ? tags : Collections.emptyList());

        return listingRepository.save(listing);
    }

    @GetMapping("/search")
    public List<Listing> searchListings(
        @RequestHeader("Authorization") String authHeader,
        @RequestParam(required = false) String title,
        @RequestParam(required = false) List<String> tags,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice
    ) {
        // 1) extract the user’s university from JWT
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String university = claims.get("university", String.class);

        // 2) load everything in that university
        List<Listing> base = listingRepository.findBySchoolId(university);

        // 3) in‐memory filter chain (for simplicity; for large datasets swap to MongoTemplate)
        return base.stream()
        .filter(l -> title == null
            || l.getTitle().toLowerCase().contains(title.toLowerCase()))
        .filter(l -> tags == null || tags.isEmpty()
            || l.getTags().stream().anyMatch(tags::contains))
        .filter(l -> minPrice == null || l.getPrice() >= minPrice)
        .filter(l -> maxPrice == null || l.getPrice() <= maxPrice)
        .collect(Collectors.toList());
    }

    @GetMapping("/university")
    public List<Listing> listByUniversity(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String university = claims.get("university", String.class);

        return listingRepository.findBySchoolId(university);
    }

    @GetMapping("/me")
    public List<Listing> listMyListings(
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String email = claims.getSubject();
        String university = claims.get("university", String.class);

        return listingRepository.findByOwnerIdAndSchoolId(email, university);
    }

    @GetMapping("/{id}")
    public Listing getListingById(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable String id
    ) {
        // parse token
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String university = claims.get("university", String.class);

        // fetch and validate school
        return listingRepository.findById(id)
            .filter(l -> university.equals(l.getSchoolId()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteListing(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id
    ) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtUtil.getAllClaims(token);
        String email = claims.getSubject();
        String university = claims.get("university", String.class);

        // ensure only the owner from that university can delete
        Listing listing = listingRepository
                .findByIdAndOwnerIdAndSchoolId(id, email, university)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // delete images from S3
        String prefix = "https://" + bucket + ".s3.amazonaws.com/";
        for (String url : listing.getImageUrls()) {
            String key = url.replace(prefix, "");
            s3Service.deleteFile(key);
        }

        listingRepository.delete(listing);
    }
}
