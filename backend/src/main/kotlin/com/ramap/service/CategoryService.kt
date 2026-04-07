package com.ramap.service

import com.ramap.dto.CategoryRequest
import com.ramap.dto.CategoryResponse
import com.ramap.model.Category
import com.ramap.repository.CategoryRepository
import org.springframework.stereotype.Service

// 카테고리 비즈니스 로직
@Service
class CategoryService(private val categoryRepository: CategoryRepository) {

    // 전체 카테고리 조회
    fun getAll(): List<CategoryResponse> =
        categoryRepository.findAll().map { it.toResponse() }

    // 카테고리 생성
    fun create(request: CategoryRequest): CategoryResponse {
        val saved = categoryRepository.save(Category(name = request.name, description = request.description))
        return saved.toResponse()
    }

    // 카테고리 수정
    fun update(id: String, request: CategoryRequest): CategoryResponse {
        val existing = categoryRepository.findById(id)
            .orElseThrow { NoSuchElementException("카테고리를 찾을 수 없습니다. id=$id") }
        val updated = categoryRepository.save(existing.copy(name = request.name, description = request.description))
        return updated.toResponse()
    }

    // 카테고리 삭제
    fun delete(id: String) {
        if (!categoryRepository.existsById(id)) {
            throw NoSuchElementException("카테고리를 찾을 수 없습니다. id=$id")
        }
        categoryRepository.deleteById(id)
    }

    // Category 도큐먼트를 응답 DTO로 변환
    private fun Category.toResponse() = CategoryResponse(
        id = id!!,
        name = name,
        description = description
    )
}
