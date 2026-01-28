package com.tourstravels.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

// Marks this class as a Spring-managed component
@Component
public class JwtUtil {

    // ================== SECRET KEY ==================
    // Secret key used for signing JWT (must be at least 256 bits for HS256)
    private static final String SECRET =
            "tourstravelssecretkeytourstravelssecretkey123";

    // Generate HMAC SHA key from the secret string
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ================== TOKEN GENERATION ==================

    // Generates JWT token using email and role
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email) // Set email as subject (username)
                .claim("role", role) // Add custom claim for role
                .setIssuedAt(new Date()) // Token creation time
                .setExpiration(
                        new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)
                ) // Token expiration time (24 hours)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // Sign token
                .compact(); // Generate JWT string
    }

    // ================== TOKEN VALIDATION ==================

    // Validates token by checking username match and expiration
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token); // Extract email
        return username.equals(userDetails.getUsername()) // Match username
                && !isTokenExpired(token); // Check token expiration
    }

    // ================== CLAIM EXTRACTION ==================

    // Extracts username (email) from JWT token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extracts role from JWT token
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Extracts expiration date from JWT token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic method to extract any claim using a resolver function
    private <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {
        final Claims claims = extractAllClaims(token); // Get all claims
        return claimsResolver.apply(claims); // Apply resolver
    }

    // Parses JWT token and returns all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY) // Set secret key for validation
                .build()
                .parseClaimsJws(token) // Parse token
                .getBody(); // Return claims body
    }

    // Checks whether the token has expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
