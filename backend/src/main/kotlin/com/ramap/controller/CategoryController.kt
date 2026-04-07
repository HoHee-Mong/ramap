package com.ramap.controller

import com.ramap.dto.ApiResponse
import com.ramap.dto.CategoryRequest
import com.ramap.service.CategoryService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

// 카테고리 API 엔드포인트
@RestController
@RequestMapping("/api/v1/categories")
class CategoryController(private val categoryService: CategoryService) {

    // 전체 카테고리 조회 (누구나)
    @GetMapping
    fun getAll(): ApiResponse<*> = ApiResponse.ok(categoryService.getAll())

    // 카테고리 생성 (관리자만)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody request: CategoryRequest): ApiResponse<*> =
        ApiResponse.ok(categoryService.create(request))

    // 카테고리 수정 (관리자만)
    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody request: CategoryRequest): ApiResponse<*> =
        ApiResponse.ok(categoryService.update(id, request))

    // 카테고리 삭제 (관리자만)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: String) = categoryService.delete(id)
}
