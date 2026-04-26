package com.ecommerce.service;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductService {

    @Autowired private ProductRepository  productRepository;
    @Autowired private CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Product> getAll()                       { return productRepository.findAllByOrderByCreatedAtDesc(); }

    @Transactional(readOnly = true)
    public List<Product> getTopRated()                  { return productRepository.findTop8ByOrderByRatingDesc(); }

    @Transactional(readOnly = true)
    public List<Product> getByCategory(Long categoryId) { return productRepository.findByCategoryId(categoryId); }

    @Transactional(readOnly = true)
    public List<Product> search(String keyword)         { return productRepository.searchByKeyword(keyword); }

    @Transactional(readOnly = true)
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    @Transactional
    public Product create(ProductDTO dto) {
        Product product = mapToEntity(dto, new Product());
        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long id, ProductDTO dto) {
        Product existing = getById(id);
        mapToEntity(dto, existing);
        return productRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id))
            throw new ResourceNotFoundException("Product", "id", id);
        productRepository.deleteById(id);
    }

    private Product mapToEntity(ProductDTO dto, Product product) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock() != null ? dto.getStock() : 0);
        product.setImageUrl(dto.getImageUrl());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));
            product.setCategory(cat);
        }
        return product;
    }
}
