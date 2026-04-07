package com.ramap.dto

// 카테고리 생성/수정 요청 DTO
data class CategoryRequest(
    val name: String,
    val description: String = ""
)

// 카테고리 응답 DTO
data class CategoryResponse(
    val id: String,
    val name: String,
    val description: String
)
