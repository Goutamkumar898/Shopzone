package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "false") boolean topRated) {

        List<Product> products;
        if (search != null && !search.isBlank())
            products = productService.search(search);
        else if (categoryId != null)
            products = productService.getByCategory(categoryId);
        else if (topRated)
            products = productService.getTopRated();
        else
            products = productService.getAll();

        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> create(@Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Product created", productService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> update(@PathVariable Long id,
                                                        @Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
    }
}
